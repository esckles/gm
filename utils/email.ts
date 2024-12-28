import { google } from "googleapis";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import path from "node:path";
import ejs from "ejs";

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const GOOGLE_URL = process.env.GOOGLE_URL;
const GOOGLE_TOKEN = process.env.GOOGLE_TOKEN;

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);

oAuth.setCredentials({ refresh_token: GOOGLE_TOKEN });

export const createaccountEmail = async (user: any) => {
  const accessToken: any = (await oAuth.getAccessToken()).token;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GOOGLE_MAIL as string,
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      refreshToken: GOOGLE_TOKEN,
      accessToken,
    },
  });

  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  const URL_value = `http://localhost:5173/auth/login/${token}`;

  const pathFile = path.join(__filename, "../view/createaccount.ejs");
  const html = await ejs.renderFile(pathFile, {
    user: user?.name,
    url: URL_value,
  });

  const mailer = {
    to: user?.email,
    from: `account creation <${process.env.GOOGLE_MAIL as string}>`,
    subject: "account verification",
    html,
  };

  transporter.sendMail(mailer).then(() => {
    console.log("send");
  });
};
