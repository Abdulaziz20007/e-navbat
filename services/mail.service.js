const nodemailer = require("nodemailer");
const config = require("config");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "mail",
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: true,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_password"),
      },
    });
  }
  async sendMailActivationCode(toEmail, otp) {
    const html = `
      <div style="
        font-family: Arial, sans-serif; 
        text-align: center; 
        background-color: #f9f9f9; 
        padding: 20px; 
        border: 1px solid #ddd; 
        border-radius: 10px; 
        max-width: 400px; 
        margin: 20px auto; 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <h2 style="
            color: #333; 
            font-size: 20px; 
            margin-bottom: 15px;">
            Akkauntni faollashtirish uchun bir martalik kod
          </h2>
          <h1 style="
            color: #007BFF; 
            font-size: 36px; 
            font-weight: bold; 
            margin: 0;">
            ${otp}
          </h1>
      </div>
      `;
    console.log("Recipient email:", toEmail);
    await this.transporter.sendMail({
      from: config.get("smtp_user"),
      to: toEmail,
      subject: "E-Navbat akkauntini faollashtirish",
      text: "",
      html,
    });
  }
}

module.exports = new MailService();
