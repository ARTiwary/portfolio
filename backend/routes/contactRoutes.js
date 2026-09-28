const router = require('express').Router();
const Contact = require('../models/Contact');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Prevent HTML injection in the auto-reply
const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Email to Ayush
    try {
      const { error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'ayushrajtiwary07@gmail.com',
        subject: `New Portfolio Inquiry: ${name}`,
        text: `From: ${name} (${email})\n\nMessage: ${message}`
      });
      if (error) throw new Error(error.message);
      console.log('✅ Notification email sent to Ayush');
    } catch (err) {
      console.error('❌ Failed to send notification to Ayush:', err.message);
    }

    // Thank you email to sender
    try {
      const { error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Thanks for reaching out!',
        html: `<p>Hi ${escapeHtml(name)}, thanks for reaching out to Ayush!</p>`
      });
      if (error) throw new Error(error.message);
      console.log('✅ Thank you email sent to sender');
    } catch (err) {
      console.error('❌ Failed to send thank you email:', err.message);
    }

    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('❌ Contact route error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;