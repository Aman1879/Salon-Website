const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static images from frontend public folder
app.use('/images', express.static(path.join(__dirname, '../../frontend/public/images')));

// Import routes
const apiRoutes = require('./routes');

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'GlowStack API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../../frontend/build')));
  
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
//   });
// }

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Services API: http://localhost:${PORT}/api/services`);
  console.log(`🖼️  Gallery API: http://localhost:${PORT}/api/gallery`);
  console.log(`📸 Images served from: http://localhost:${PORT}/images/`);
});
