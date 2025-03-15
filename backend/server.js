const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/intake', require('./routes/intakeFormRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Set up server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});