const router = require('express').Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // 1. Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // 2. Send email notification to Ayush
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `📩 New Message from ${name} — Portfolio`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #7c3aed, #2563eb); padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 22px; color: white;">New Portfolio Message</h1>
            <p style="margin: 6px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Someone reached out via your portfolio</p>
          </div>
          <div style="padding: 28px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #9ca3af; font-size: 13px; width: 80px;">Name</td>
                <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${name}</td>
              </tr>
              <tr style="border-top: 1px solid #1f2937;">
                <td style="padding: 10px 0; color: #9ca3af; font-size: 13px;">Email</td>
                <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #818cf8; font-size: 14px;">${email}</a></td>
              </tr>
              <tr style="border-top: 1px solid #1f2937;">
                <td style="padding: 10px 0; color: #9ca3af; font-size: 13px; vertical-align: top;">Message</td>
                <td style="padding: 10px 0; color: #d1d5db; font-size: 14px; line-height: 1.6;">${message}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #1f2937; text-align: center;">
              <a href="mailto:${email}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #7c3aed, #2563eb); color: white; text-decoration: none; border-radius: 50px; font-size: 14px; font-weight: 600;">
                Reply to ${name} →
              </a>
            </div>
          </div>
          <div style="padding: 16px; text-align: center; background: #050505; color: #4b5563; font-size: 12px;">
            Ayush Raj Tiwary • Portfolio Contact System
          </div>
        </div>
      `,
    });

    // 3. Send confirmation email to the sender
    await transporter.sendMail({
      from: `"Ayush Raj Tiwary" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Thanks for reaching out, ${name}! 👋`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #7c3aed, #2563eb); padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 22px; color: white;">Message Received! 🚀</h1>
          </div>
          <div style="padding: 28px;">
            <p style="color: #d1d5db; font-size: 15px; line-height: 1.7;">Hey ${name},</p>
            <p style="color: #d1d5db; font-size: 15px; line-height: 1.7;">
              Thanks for reaching out! I've received your message and will get back to you as soon as possible — usually within 24 hours.
            </p>
            <div style="background: #111827; border-left: 3px solid #7c3aed; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 1px;">Your message</p>
              <p style="color: #d1d5db; font-size: 14px; margin: 0; line-height: 1.6;">${message}</p>
            </div>
            <p style="color: #d1d5db; font-size: 15px; line-height: 1.7;">
              In the meantime, feel free to check out my work on 
              <a href="https://github.com/ARTiwary" style="color: #818cf8;">GitHub</a> or connect on 
              <a href="https://www.linkedin.com/in/ayush-raj-tiwary-3b4392227" style="color: #818cf8;">LinkedIn</a>.
            </p>
            <p style="color: #d1d5db; font-size: 15px; line-height: 1.7;">— Ayush Raj Tiwary</p>
          </div>
          <div style="padding: 16px; text-align: center; background: #050505; color: #4b5563; font-size: 12px;">
            Ayush Raj Tiwary • Full Stack Developer & AI/ML Engineer
          </div>
        </div>
      `,
    });

    res.status(201).json({ success: true, message: 'Message sent successfully!' });

  } catch (err) {
    console.error('Contact route error:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

module.exports = router;