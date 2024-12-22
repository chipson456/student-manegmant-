const express = require('express');
const env= require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const app = express();



const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;


mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to database successfully'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));


// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging

    // Customize the response based on the error
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: {
            message: message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Show stack trace only in non-production environments
        },
    });
});
