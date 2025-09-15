import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string , appName:string) {

    

  try {
    const info = await transporter.sendMail({
      from: `${appName} <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
    return { success: true };
  } catch (err) {
    console.error("Error sending email:", err);
    return { success: false, error: "EMAIL_SEND_FAILED" };
  }
}
