import './App.css';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Papa from "papaparse";
import * as EmailView from './file/template-email'

function App() {
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [responStatus, setResponSatus] = useState([]);
  // State to store parsed data
  const [parsedData, setParsedData] = useState([]);
  //State to store table Column name
  const [tableRows, setTableRows] = useState([]);
  //State to store the values
  const [values, setValues] = useState([]);
  // const [fileTemplate, setFileTemplate] = useState("");

  // const showFile = (e) => {
  //   e.preventDefault();
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const text = e.target.result;
  //     console.log(text);
  //     // setFileTemplate(text)
  //   };
  //   reader.readAsText(e.target.files[0]);
  // };

  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values
        // eslint-disable-next-line array-callback-return
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });

        // Parsed Data Response in array format
        setParsedData(results.data);
        // Filtered Column Names
        setTableRows(rowsArray[0]);
        // Filtered Values
        setValues(valuesArray);
      },
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // if (!email || !subject || !message) {
    //   return toast.error('Please fill email, subject and message');
    // }
    try {
      setLoading(true);
      if(parsedData.length > 0){
        // eslint-disable-next-line array-callback-return
        parsedData.map(async (item) => {
          const htmlText = EmailView.htmlTemplate(item)
          const { data } = await axios.post(`/api/email`, {
            email: item?.email,
            subject,
            message: htmlText,
          });
          // toast.success(data.message);
          // console.log('ini guys: ', data.message)
          setResponSatus(current => [ ...current, {status: data.message}])
        })
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };
  return (
    <div className="App">
      <ToastContainer position="bottom-center" limit={1} />
      <header className="App-header">
        <form onSubmit={submitHandler}>
          <h1>Send Email Blast</h1>
          <div>
            <label htmlFor="email">Penerima Email</label>
            <input
              type="file"
              name="file"
              accept=".csv"
              onChange={changeHandler}
              style={{ display: "block", margin: "10px auto" }}
            />
          </div>
          {/* <div>
            <label htmlFor="email">Template Email</label>
            <input
              type="file"
              name="file"
              accept=".txt"
              onChange={showFile}
              style={{ display: "block", margin: "10px auto" }}
            />
          </div> */}
          <div>
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              onChange={(e) => setSubject(e.target.value)}
            ></input>
          </div>
          <div>
            <label></label>
            <button disabled={loading} type="submit">
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </form>
        <div style={{ height: '250px', overflowY: 'scroll', margin: '20px' }}>
          {
            responStatus.map((item, index) =>
                <p style={{ fontSize: 13, textAlign: 'left'}}>
                  {`${index + 1}. ${item?.status}`}
                </p>
            )
          }
        </div>
      </header>
    </div>
  );
}

export default App;
