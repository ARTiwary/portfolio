require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const app = express();

// 1. Trust proxy: Essential for Render/Heroku/Fly.io environments
app.set('trust proxy', 1);

// 2. Security Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', process.env.CLIENT_URL].filter(Boolean),
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));

// 3. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// 4. Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4 // Force IPv4
})
.then(() => console.log('Connected to MongoDB successfully!'))
.catch(err => {
  console.error('Critical DB Connection Error:', err.message);
  process.exit(1);
});

// 5. Routes
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// 6. Global Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Production server running on port ${PORT}`);
});