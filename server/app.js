const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const port = 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: "OCEAN(E-Referral System) PASSWORD RECOVERY",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>OCEAN - OTP Email Template</title>
        <style>
          body {
            font-family: 'sans-serif', Tahoma, Geneva, Verdana ;
            min-width: 1000px;
            overflow: auto;
            line-height: 2;
          }
          .container {
            margin: 50px auto;
            width: 70%;
            padding: 20px 0;
            overflow: auto;
            background-color: #f2f2f2;
          }
          .header {
            border-bottom: 1px solid #eee;
            background-color: #00466a;
            padding: 10px 0;
          }
          .header a {
            font-size: 1.4em;
            color: #fff;
            text-decoration: none;
            font-weight: 600;
            text-align: center;
            display: block;
          }
          .content {
            padding: 20px;
          }
          .otp {
            background: #00466a;
            margin: 20px auto;
            width: max-content;
            padding: 5px;
            color: #fff;
            border-radius: 4px;
            font-size: 1.5em;
            text-align: center;
          }
          .footer {
            float: right;
            padding: 8px 0;
            color: #aaa;
            font-size: 0.8em;
            line-height: 1;
            font-weight: 300;
          }
        </style>
      </head>
      <body>
      <div class="container">
        <div class="header">
          <a href="#" class="header-link">OCEAN E-Referral System</a>
        </div>
        <div class="content">
          <p>Hi,</p>
          <p>Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
          <h2 class="otp">${OTP}</h2>
          <p>Regards,<br />OCEAN</p>
          <hr />
          <div class="footer">
            <p>OCEAN(E-Referral Sys) Inc</p>
            <p>Gujarat</p>
            <p>India</p>
          </div>
        </div>
      </div>
      </body>
      </html>
      `,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

app.get("/", (req, res) => {
    // res.send("Hello")
    console.log(process.env.MY_EMAIL);
});

app.post("/send_recovery_email", (req, res) => {
  sendEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.listen(port, () => {
  console.log(`nodemailerProject is listening at http://localhost:${port}`);
});