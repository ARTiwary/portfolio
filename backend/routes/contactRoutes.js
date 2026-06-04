const router = require('express').Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });
    
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

module.exports = router;