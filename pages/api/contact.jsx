import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import sanityClient from "../../libs/SanityClient";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;
    console.log("Incoming request:", body);

    const { name, email, subject, message, captchaToken } = body;
    if (!name || !email || !subject || !message || !captchaToken) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const recaptchaSuccess = await verifyRecaptcha(captchaToken);
    if (!recaptchaSuccess) {
      return res.status(403).json({ error: "reCAPTCHA verification failed" });
    }

    try {
      const sanityResponse = await sanityClient.create({
        _type: "contactFormPortfolio",
        name,
        email,
        subject,
        message,
        createdAt: new Date().toISOString(),
      });
      console.log("Sanity response:", sanityResponse);
    } catch (error) {
      console.error("Sanity error:", error);
      return res.status(500).json({ error: "Failed to save data to Sanity" });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.eu",
        port: 465,
        secure: true,
        auth: {
          user: process.env.CONTACT_EMAIL,
          pass: process.env.ZOHO_EMAIL_PASS,
        },
      });

      const emailResponse = await transporter.sendMail({
        from: process.env.CONTACT_EMAIL,
        to: process.env.ZOHO_EMAIL_USER,
        subject: `Form Submission - ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong> ${message}</p>`,
      });

      console.log("Email response:", emailResponse);
    } catch (error) {
      console.error("Email sending error:", error);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;

async function verifyRecaptcha(captchaToken) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`,
      { method: "POST" }
    );
    const data = await response.json();
    console.log("reCAPTCHA response:", data);
    return data.success && data.score > 0.5;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}
