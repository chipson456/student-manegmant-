import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/userModel.js'; // ייבוא מודל המשתמש שלך
import dotenv from 'dotenv';

dotenv.config(); // טוען את קובץ .env

const addAdmin = async () => {
    try {
        // יצירת סיסמה מוצפנת
        const hashedPassword = await bcrypt.hash('admin123', 10); // החלף בסיסמה הרצויה

        // יצירת משתמש מנהל חדש
        const newAdmin = new User({
            username: 'admin',
            password: hashedPassword,
            email: 'admin@example.com',
            phone: '0509999999',
            role: 'admin',
        });

        // שמירת המשתמש בבסיס הנתונים
        await newAdmin.save();
        console.log('Admin added successfully!');
    } catch (err) {
        console.error('Error adding admin:', err);
    } finally {
        // ניתוק החיבור ל-MongoDB
        mongoose.disconnect();
    }
};

// חיבור ל-MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        return addAdmin(); // קריאה לפונקציה להוספת המנהל
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });
