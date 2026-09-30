const router = require('express').Router();
const Contact = require('../models/Contact');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const notificationEmail = (name, email, message) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#09090f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090f;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:linear-gradient(135deg,#7c3aed,#2563eb);padding:36px 40px;border-radius:16px 16px 0 0;text-align:center;">
          <div style="font-size:40px;margin-bottom:12px;">📩</div>
          <h1 style="color:white;margin:0;font-size:22px;font-weight:700;">New Portfolio Enquiry</h1>
          <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:14px;">Someone reached out via your portfolio</p>
        </td></tr>
        <tr><td style="background:#111118;padding:36px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td style="background:#1a1a2e;border:1px solid rgba(139,92,246,0.2);border-radius:10px;padding:16px 20px;width:48%;">
                <p style="color:#7c3aed;font-size:10px;text-transform:uppercase;letter-spacing:2px;margin:0 0 4px;">From</p>
                <p style="color:#e2d9ff;font-size:15px;font-weight:600;margin:0;">${name}</p>
              </td>
              <td width="4%"></td>
              <td style="background:#1a1a2e;border:1px solid rgba(139,92,246,0.2);border-radius:10px;padding:16px 20px;width:48%;">
                <p style="color:#7c3aed;font-size:10px;text-transform:uppercase;letter-spacing:2px;margin:0 0 4px;">Email</p>
                <a href="mailto:${email}" style="color:#818cf8;font-size:14px;text-decoration:none;">${email}</a>
              </td>
            </tr>
          </table>
          <div style="background:#1a1a2e;border:1px solid rgba(139,92,246,0.2);border-left:3px solid #7c3aed;border-radius:0 10px 10px 0;padding:20px 24px;margin-bottom:28px;">
            <p style="color:#7c3aed;font-size:10px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Message</p>
            <p style="color:#d1d5db;font-size:15px;line-height:1.7;margin:0;">${message}</p>
          </div>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="mailto:${email}?subject=Re: Your enquiry on my portfolio" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#2563eb);color:white;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:14px;font-weight:600;">
                Reply to ${name} →
              </a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background:#0d0d14;border-top:1px solid rgba(139,92,246,0.15);padding:20px 40px;border-radius:0 0 16px 16px;text-align:center;">
          <p style="color:#4b5563;font-size:12px;margin:0;">Ayush Raj Tiwary • Portfolio Contact System</p>
          <a href="https://artiwary.vercel.app" style="color:#6d28d9;font-size:11px;text-decoration:none;">artiwary.vercel.app</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const thankYouEmail = (name, message) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#09090f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090f;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:linear-gradient(135deg,#7c3aed,#2563eb);padding:40px;border-radius:16px 16px 0 0;text-align:center;">
          <div style="font-size:48px;margin-bottom:12px;">🚀</div>
          <h1 style="color:white;margin:0;font-size:24px;font-weight:700;">Message Received!</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:15px;">I'll get back to you very soon</p>
        </td></tr>
        <tr><td style="background:#111118;padding:40px;">
          <p style="color:#d1d5db;font-size:16px;line-height:1.7;margin:0 0 20px;">Hey <strong style="color:#c4b5fd;">${name}</strong> 👋</p>
          <p style="color:#9ca3af;font-size:15px;line-height:1.7;margin:0 0 28px;">
            Thanks for reaching out through my portfolio! I've received your message and will personally get back to you within <strong style="color:#e2d9ff;">24 hours</strong>.
          </p>
          <div style="background:#1a1a2e;border:1px solid rgba(139,92,246,0.2);border-left:3px solid #7c3aed;border-radius:0 10px 10px 0;padding:20px 24px;margin-bottom:28px;">
            <p style="color:#7c3aed;font-size:10px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Your Message</p>
            <p style="color:#9ca3af;font-size:14px;line-height:1.7;margin:0;font-style:italic;">"${message}"</p>
          </div>
          <div style="background:#1a1a2e;border:1px solid rgba(139,92,246,0.15);border-radius:12px;padding:20px 24px;margin-bottom:28px;">
            <p style="color:#7c3aed;font-size:10px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">While you wait — check out my work</p>
            <p style="margin:4px 0;"><a href="https://github.com/ARTiwary" style="color:#818cf8;font-size:13px;text-decoration:none;">🐙 GitHub — github.com/ARTiwary</a></p>
            <p style="margin:4px 0;"><a href="https://www.linkedin.com/in/ayush-raj-tiwary-3b4392227" style="color:#818cf8;font-size:13px;text-decoration:none;">💼 LinkedIn — Ayush Raj Tiwary</a></p>
            <p style="margin:4px 0;"><a href="https://artiwary.vercel.app" style="color:#818cf8;font-size:13px;text-decoration:none;">🌐 Portfolio — artiwary.vercel.app</a></p>
          </div>
          <p style="color:#9ca3af;font-size:15px;line-height:1.7;margin:0 0 8px;">Looking forward to connecting!</p>
          <p style="color:#e2d9ff;font-size:15px;font-weight:600;margin:0;">— Ayush Raj Tiwary</p>
          <p style="color:#6b7280;font-size:13px;margin:4px 0 0;">Full Stack Developer & AI/ML Engineer</p>
        </td></tr>
        <tr><td style="background:#0d0d14;border-top:1px solid rgba(139,92,246,0.15);padding:20px 40px;border-radius:0 0 16px 16px;text-align:center;">
          <p style="color:#4b5563;font-size:12px;margin:0;">You received this because you contacted Ayush via his portfolio.</p>
          <a href="https://artiwary.vercel.app" style="color:#6d28d9;font-size:11px;text-decoration:none;">artiwary.vercel.app</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Email to Ayush
    try {
      await resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: process.env.GMAIL_USER,
        subject: `📩 New Enquiry from ${name} — Portfolio`,
        html: notificationEmail(name, email, message),
      });
      console.log('✅ Notification sent to Ayush');
    } catch (err) {
      console.error('❌ Notification failed:', err.message);
    }

    // Thank you email to sender
    try {
      await resend.emails.send({
        from: 'Ayush Raj Tiwary <onboarding@resend.dev>',
        to: email,
        subject: `Thanks for reaching out, ${name}! 🚀`,
        html: thankYouEmail(name, message),
      });
      console.log('✅ Thank you email sent to:', email);
    } catch (err) {
      console.error('❌ Thank you email failed:', err.message);
    }

    res.status(201).json({ success: true });

  } catch (err) {
    console.error('Contact route error:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

module.exports = router;