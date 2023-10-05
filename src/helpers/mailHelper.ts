import nodemailer from 'nodemailer';
// const nodemailer = require('nodemailer');
import { google } from 'googleapis';
import config from '../config';

const CLIENT_ID = config.mail.client_id;
const CLEINT_SECRET = config.mail.client_secret;
const REDIRECT_URI = config.mail.redirect_uri;
const REFRESH_TOKEN = config.mail.refresh_token;
const MAIL_SENDER = config.mail.mail_sender;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function sendMail(
  receiverEmail: string,
  subject: string,
  mailContent: string
) {
  try {
    const oAuth2Client = new google.auth.OAuth2({
      clientId: CLIENT_ID,
      clientSecret: CLEINT_SECRET,
      redirectUri: REDIRECT_URI,
    });

    oAuth2Client.setCredentials({
      refresh_token: REFRESH_TOKEN,
    });

    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: MAIL_SENDER,
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: `BlogLab < ${MAIL_SENDER}>`,
      to: receiverEmail,
      subject: subject,
      text: mailContent,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}
