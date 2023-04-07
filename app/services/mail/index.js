const nodemailer = require("nodemailer"); //library untuk kirim email
const { gmail, password } = require("../../config");
const Mustache = require("mustache"); // untuk render template html
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: gmail,
    pass: password,
  },
});

const otpMail = async (email, data) => {
  try {
    let template = fs.readFileSync("app/views/email/otp.html", "utf8"); // untuk generate template html

    let message = {
      from: gmail,
      to: email, // kirim dari parameter async function
      subject: "Otp for registration is: ",
      html: Mustache.render(template, data), // untuk render template html | params data itu adalah data user yang di daftarin
    };

    return await transporter.sendMail(message);
  } catch (ex) {
    console.log(ex);
  }
};

module.exports = { otpMail };
