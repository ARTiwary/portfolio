const router = require('express').Router();
const Contact = require('../models/Contact');
const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // 1. Save to Database
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // 2. Send email notification to YOU
    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'ayushrajtiwary07@gmail.com',
      subject: `New Portfolio Inquiry: ${name}`,
      text: `From: ${name} (${email})\n\nMessage: ${message}`
    }).catch(err => console.error('Admin email failed:', err));

    // 3. Send AUTO-REPLY to the SENDER
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
          <p>Best regards,<br>
          <strong>Ayush Raj Tiwary</strong></p>
        </div>
      `
    }).catch(err => console.error('Auto-reply failed:', err));

    res.status(201).json({ success: true, message: 'Message sent successfully!' });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Failed to process request.' });
  }
});

module.exports = router;