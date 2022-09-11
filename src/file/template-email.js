export const htmlTemplate = (data) => {
  return `
  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>

    <body>
        <div style="font-family: Helvetica;color: #19a3ab;">
            <div>
            <table align="center" style="border-bottom: solid 1px #E3E3E3; margin-bottom: 1%;" cellpadding="5" cellspacing="0"  border-collapse="collapse" width="100%">
                <tr>
                    <td>
                        <b><div>Kode Undangan</div></b>
                    </td>
                    <td>
                        <div>${data?.kode_undangan}</div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <b><div>Nama Lengkap</div></b>
                    </td>
                    <td>
                        <div>${data?.salutation}</div><div>${data?.full_name}</div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <b><div>Email</div></b>
                    </td>
                    <td>
                        <div>${data?.email}</div>
                    </td>
                </tr>
            </table>
            </div>
        </div>
    </body>
  </html>
  `
}