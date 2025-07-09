
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cardRoutes = require('./routes/cardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://anmolpanchal0207:8wKU26WGdc0ClemM@cluster0.koue2dy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/docsApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB Error:', err));

// API routes
app.use('/api/cards', cardRoutes);

// Serve static files from client/dist
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle all other routes with index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
