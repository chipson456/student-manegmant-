import express from 'express';
import User from '../models/userModel.js'; // ייבוא מודל המשתמש
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import File from '../models/fileModel.js';
import fs from 'fs/promises';

const router = express.Router();

// בדיקה שהשרת פועל
router.get('/', (req, res) => {
    res.status(200).send('Server is running');
});

// נתיב לשליפת כל המשתמשים (גישה רק למנהלים)
router.get('/users', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'שגיאה בשרת בזמן שליפת המשתמשים', error: err.message });
    }
});

// נתיב למחיקת משתמש (גישה רק למנהלים)
router.delete('/users/:id', authenticate, authorizeAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'משתמש נמחק בהצלחה!' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'שגיאה בשרת', error: err.message });
    }
});

// נתיב להוספת משתמש
router.post('/add-user', authenticate, authorizeAdmin, async (req, res) => {
    const { username, password, email, phone, role } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'אנא ודא שכל השדות הנדרשים מלאים.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // הצפנת הסיסמה
        const newUser = new User({ username, password: hashedPassword, email, phone, role });
        await newUser.save();
        res.status(201).json({ message: 'משתמש נוסף בהצלחה!' });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'שם המשתמש או האימייל כבר קיימים במערכת.' });
        } else {
            console.error('Error adding user:', err);
            res.status(500).json({ message: 'שגיאה בשרת.', error: err.message });
        }
    }
});

// נתיב התחברות
// נתיב התחברות
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'שם המשתמש או הסיסמה שגויים.' });
        }

        // בדיקת סיסמה מוצפנת
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'שם המשתמש או הסיסמה שגויים.' });
        }

        // יצירת טוקן
        const token = jwt.sign(
            { 
                id: user._id,
                username: user.username,
                 role: user.role 
                },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // מחזירים את ה-token ואת ה-username
        res.status(200).json({
            message: 'התחברת בהצלחה!',
            token,
            username: user.username, // הוספת שם המשתמש לתגובה
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'שגיאה בשרת', error: err.message });
    }
});


// נתיב לעדכון פרטי משתמש (גישה למנהלים בלבד)
router.put('/users/:id', authenticate, authorizeAdmin, async (req, res) => {
    const { id } = req.params;
    const { username, email, phone, role } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, email, phone, role },
            { new: true }
        );
        res.status(200).json({ message: 'משתמש עודכן בהצלחה!', user: updatedUser });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'שגיאה בשרת.', error: err.message });
    }
});

// הגדרת תיקייה לשמירת קבצים
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // שומר רק את השם המקורי
    },
});


const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'לא הועלה קובץ.' });
        }

        // שמירת פרטי הקובץ ב-Database
        const fileData = {
            studentName: req.body.studentName,
            fileName: req.file.filename,
            fileUrl: `/uploads/${req.file.filename}`,
        };

        await File.create(fileData);
        res.status(200).json({ message: 'קובץ הועלה בהצלחה!', fileData });
    } catch (err) {
        res.status(500).json({ message: 'שגיאה בשרת.', error: err.message });
    }
});

router.get('/files', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const files = await File.find(); // Assumes you have a File model
        res.status(200).json(files);
    } catch (err) {
        res.status(500).json({ message: 'שגיאה בטעינת הקבצים', error: err.message });
    }
});

 // מחיקת קובץ מהשרת ומה-Database
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.delete('/delete', authenticate, async (req, res) => {
    const { fileName } = req.body;
  
    if (!fileName) {
      return res.status(400).json({ message: 'שם הקובץ לא סופק.' });
    }
  
    const filePath = path.join(__dirname, '..', 'uploads', fileName);
  
    try {
      await fs.access(filePath); // בדיקה אם הקובץ קיים
      await fs.unlink(filePath); // מחיקה מהשרת
      await File.findOneAndDelete({ fileName }); // מחיקה מ-MongoDB
      res.status(200).json({ message: 'הקובץ נמחק בהצלחה!' });
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.status(404).json({ message: 'הקובץ לא נמצא.' });
      } else {
        res.status(500).json({ message: 'שגיאה בשרת.', error: err.message });
      }
    }
  });
  

  

 



export default router;
