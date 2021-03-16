const nodemailer = require('nodemailer');
import * as dotenv from 'dotenv';

const user = process.env.HOST_MAIL;
const pass = process.env.MAIL_PASS;

const transport = nodemailer.createTransport({
  service: 'Mail.ru',
  auth: {
    user: user,
    pass: pass,
  },
});

export const sendConfirmationEmail = (name, email, confirmationCode) => {
  console.log('Check');
  transport
    .sendMail({
      from: user,
      to: email,
      subject: 'Please confirm your account',
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Please confirm to reset and get new password by clicking on the following link</p>
          <a href=https://${process.env.DATABASE_HOST}/api/gym/auth/confirm/${confirmationCode}> Click here</a>
          </div>`,
    })
    .catch((err) => console.log(err));
};
