// MUST BE AT THE VERY TOP: Force IPv4 to resolve SMTP/Network connection issues
const dns = require("node:dns");
dns.setDefaultResultOrder("ipv4first");

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// --- DEBUG: Verify ENV variables ---
// Note: Ensure these are set in the Render "Environment" tab
const requiredEnv = ['MONGODB_URI', 'GMAIL_USER', 'GMAIL_PASS'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(`CRITICAL: Missing environment variables: ${missingEnv.join(', ')}`);
}

const app = express();
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://artiwary.vercel.app', 'https://portfolio-backend-1y6d.onrender.com'],
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
app.use('/api/', rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: "Too many requests, please try again later."
}));

// Routes
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/chat', require('./routes/chatRoutes')); // Assuming you have this route

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));