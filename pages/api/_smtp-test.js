import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    const { to = process.env.EMAIL_SERVER_USER } = req.query; // default: send to postmaster
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT || 587),
      secure: String(process.env.EMAIL_SERVER_PORT) === "465",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: "SMTP test from MWM Website",
      text: "If you received this, SMTP works.",
    });

    res.status(200).json({ ok: true, messageId: info.messageId, envelope: info.envelope });
  } catch (e) {
    res.status(500).json({ ok: false, name: e.name, code: e.code, message: e.message });
  }
}
