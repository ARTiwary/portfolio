const router = require('express').Router();
const Contact = require('../models/Contact');
const { Resend } = require('resend');

// Initialize Resend with the key from your Render Environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 1. Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // 2. Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // 3. Send Email Notifications via Resend (HTTP API)
    // We initiate these requests but don't 'await' them to keep the response fast.
    
    // Email to you
    resend.emails.send({
      from: 'onboarding@resend.dev', // Default sender, can be customized later
      to: process.env.GMAIL_USER,    // Your email address
      subject: `New Portfolio Inquiry: ${name}`,
      text: `From: ${name} (${email})\n\nMessage: ${message}`
    }).catch(err => console.error('Resend Admin Email Failed:', err));

    // Auto-reply to the user
    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: "Thanks for reaching out!",
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2>Hi ${name},</h2>
          <p>Thanks for visiting my portfolio and reaching out!</p>
          <p>I have received your message and will get back to you as soon as possible.</p>
          <br>
          <p>Best regards,<br><strong>Ayush Raj Tiwary</strong></p>
        </div>
      `
    }).catch(err => console.error('Resend Auto-reply Failed:', err));

    // 4. Send success response
    res.status(201).json({ success: true, message: 'Message sent successfully!' });

  } catch (err) {
    console.error('Database/Server error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;