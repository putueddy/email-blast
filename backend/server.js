const express = require('express');
const dotenv = require('dotenv');
const mg = require('mailgun-js');

dotenv.config();

const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMIAN,
  });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/email', (req, res) => {
  const { email, subject, message } = req.body;

  mailgun()
    .messages()
    .send(
      {
        from: `${process.env.MAILGUN_FROM}`,
        to: `${email}`,
        subject: `${subject}`,
        html: `{${message}}`,
        'o:tracking-clicks': 'no'
      },
      (error, body) => {
        if (error) {
          console.log(error);
          res.status().send({ message: `${email} - Error in sending email` });
        } else {
          console.log(body);
          res.send({ message: `${email} - Email sent successfully` });
        }
      }
    );
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
