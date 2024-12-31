const express = require('express');
const env = require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const app = express();

const mongoURI = process.env.MONGO_URI;

// Enhanced Connection Options
const connectionOptions = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    retryWrites: true,
    w: 'majority',
    ssl: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false
};

async function connectToMongoDB() {
    try {
        // Mongoose Connection
        await mongoose.connect(mongoURI, connectionOptions);
        console.log('Mongoose Connected Successfully');

        // Direct MongoDB Client Connection
        const client = new MongoClient(mongoURI, connectionOptions);
        await client.connect();
        console.log('Direct MongoDB Client Connection Successful');
        await client.close();
    } catch (error) {
        console.error('Detailed MongoDB Connection Error:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });

        // Implement exponential backoff for reconnection
        setTimeout(connectToMongoDB, 5000);
    }
}

// Connection Event Listeners
mongoose.connection.on('connected', () => {
    console.log('Mongoose Connected Successfully');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose Connection Error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose Disconnected');
    connectToMongoDB();
});

// Initial Connection Attempt
connectToMongoDB();// Create uploads directory if it doesn't exist
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

    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: {
            message: message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        },
    });
});