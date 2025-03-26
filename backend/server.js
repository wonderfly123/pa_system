const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const axios = require('axios');
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

// PA System Assistant API proxy endpoint
app.post('/api/pa-assistant', async (req, res) => {
  try {
    console.log('Proxy received request:', req.body);
    
    const response = await axios.post(
      'https://prodeu-connectfasterinc-cloud-fm.emea.snaplogic.io/api/1/rest/feed/run/task/ConnectFasterInc/Jordan%20Millhausen/Millhausen_pa_system/PASystemAgentDriver_api_v2',
      req.body,
      {
        headers: {
          'Authorization': `Bearer 12345`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );
    
    console.log('Proxy received response:', response.status);
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      res.status(error.response.status).json({
        error: 'API error',
        message: error.message,
        details: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received');
      res.status(500).json({
        error: 'No response from API',
        message: 'The service is not responding'
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({
        error: 'Request setup error',
        message: error.message
      });
    }
  }
});

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