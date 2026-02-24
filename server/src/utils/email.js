const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "brooklyn.welch41@ethereal.email",
      pass: "4KUtbjXhBAqdX1N6Q5",
    },
  });

  const mailOptions = {
    from: "Email Builder <noreply@emailbuilder.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;