import express from 'express'; // ייבוא ספריית express ליצירת אפליקציה
import cors from 'cors'; // ייבוא CORS לאפשר תקשורת בין דומיינים
import bodyParser from 'body-parser'; // ייבוא body-parser לניתוח תוכן בקשות HTTP
import fs from 'fs'; // ייבוא fs לעבודה עם מערכת קבצים
import path from 'path'; // ייבוא path לעבודה עם נתיבים
import { fileURLToPath } from 'url'; // ייבוא fileURLToPath כדי לתמוך ב-__dirname
import mongoose from 'mongoose'; // ייבוא mongoose לחיבור למסד הנתונים
import authRoutes from './routes/auth.js'; // מסלולים עבור אימות
import uploadRoutes from './routes/upload.js'; // מסלולים עבור העלאת קבצים
import dotenv from 'dotenv';
dotenv.config();


// יצירת __dirname מותאם ל-ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // יצירת אפליקציית Express

// חיבור ל-MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/test'; // הגדרת URI למסד הנתונים

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000 // מגבלת זמן לחיבור
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err.message);
});

// יצירת תיקיית uploads אם אינה קיימת
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(uploadsDir)); // הפיכת תיקיית uploads לציבורית

// Routes
app.use('/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// הפעלת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

