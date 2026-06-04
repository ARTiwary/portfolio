const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend ready on port ${PORT}`));