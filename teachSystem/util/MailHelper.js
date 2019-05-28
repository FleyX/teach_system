const nodeMailer = require("nodemailer");
const config = require("../config/config.js");

let transporter = nodeMailer.createTransport(config.mail);
var mailOptions = {
  from: config.mail.auth.user // 发送者
};

let resetPass = (code, mail) => {
  mailOptions.text = `您正在请求重置密码,验证码为(五分钟内有效)：${code}`;
  mailOptions.html = `
        <div><p>您正在请求重置密码，验证码为(五分钟内有效)：</p><h2 style="margin:0 auto;">${code}</h2></div>
    `;
  mailOptions.subject = "验证码请求";
  mailOptions.to = mail;
  return transporter.sendMail(mailOptions);
};

module.exports = {
  resetPass
};
