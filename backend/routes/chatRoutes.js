const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const ollama = require('ollama');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
  const { message, history, useLocal } = req.body;

  try {
    let reply;
    if (useLocal) {
      // Logic for Ollama
      const response = await ollama.chat({
        model: 'llama3',
        messages: [{ role: 'user', content: message }],
      });
      reply = response.message.content;
    } else {
      // Logic for Groq (Fastest)
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: message }],
        model: "llama3-8b-8192",
      });
      reply = chatCompletion.choices[0].message.content;
    }
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: "AI Service Error" });
  }
});

module.exports = router;