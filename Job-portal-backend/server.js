const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const app = express();

// Load environment variables
require('dotenv').config();

console.log('MONGO_URI:', process.env.MONGO_URI); // Debug log
console.log('JWT_SECRET:', process.env.JWT_SECRET); // Optional
console.log('PORT:', process.env.PORT); // Optional

app.use(cors({
  //origin: 'http://your-react-native-app-domain.com', // or use ['http://192.168.x.x:19006'] for dev
}));
app.use(express.json());

app.use('/api', authRoutes);

// Validate MONGO_URI before connecting
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file!");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message || err);
    process.exit(1);
  });