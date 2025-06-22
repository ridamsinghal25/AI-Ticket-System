import nodemailer from "nodemailer";

export const sendMail = async (to, subject, text) => {
  try {
    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: process.env.MAILTRAP_SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: "Inngest TMS",
      to,
      subject,
      text,
    });

    console.log("Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Mail error", error.message);
    throw error;
  }
};
