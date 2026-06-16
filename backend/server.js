// MUST BE AT THE VERY TOP
const dns = require("node:dns/promises");
dns.setServers(["8.8.8.8", "1.1.1.1"]); 

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// --- DEBUG: Verify ENV variables ---
if (!process.env.MONGODB_URI || !process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
  console.error("CRITICAL: Environment variables are missing!");
}

const app = express();
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://artiwary.vercel.app'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(err => console.error('Critical DB Connection Error:', err.message));

// Health Check
app.get('/', (req, res) => res.status(200).json({ status: 'API is running' }));

// Rate Limiting
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
// Note: We use the require here to avoid circular dependency loops during initialization
app.use('/api/contact', require('./routes/contactRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));