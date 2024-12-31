import express from 'express'; // ייבוא ספריית express לניהול מסלולים.
import multer from 'multer'; // ייבוא multer לטיפול בהעלאת קבצים.
import path from 'path'; // ייבוא path לעבודה עם נתיבי קבצים.
import { fileURLToPath } from 'url';

const router = express.Router(); // יצירת אובייקט router לניהול מסלולים.

const __filename = fileURLToPath(import.meta.url); // מייצר את שם הקובץ המלא
const __dirname = path.dirname(__filename); // מייצר את נתיב התיקיה

const uploadsDir = path.join(__dirname, 'uploads'); // יצירת נתיב לתיקיית uploads
const storage = multer.diskStorage({ // הגדרת אחסון קבצים בשרת.
    destination: (req, file, cb) => { // יעד שמירת הקובץ.
        cb(null, uploadsDir); // שימוש בתיקיית uploads.
    },
    filename: (req, file, cb) => { // שם ייחודי לקובץ שמועלה.
        cb(null, Date.now() + '-' + file.originalname); // הוספת timestamp לשם הקובץ המקורי.
    }
});

const fileFilter = (req, file, cb) => { // פילטר להגבלת סוגי הקבצים המועלים.
    if (file.fieldname === 'image') { // בדיקה אם מדובר בקובץ מסוג תמונה.
        if (!file.mimetype.startsWith('image/')) { // אם סוג הקובץ אינו תמונה.
            return cb(new Error('Only images are allowed!'), false); // החזרת שגיאה.
        }
    }
    cb(null, true); // אישור העלאת הקובץ אם התקבל תקין.
};

const upload = multer({  // הגדרת multer עם אחסון ופילטרים.
    storage: storage, // שימוש בהגדרות אחסון.
    fileFilter: fileFilter, // שימוש בפילטרים לקבצים.
    limits: {
        fileSize: 5 * 1024 * 1024 // מגבלת גודל קובץ: 5MB.
    }
});

router.post('/file', upload.single('file'), (req, res) => { // מסלול להעלאת קובץ.
    try {
        if (!req.file) { // אם לא הועלה קובץ.
            return res.status(400).json({ error: 'No file uploaded' }); // החזרת שגיאה.
        }
        res.json({  // תגובה על הצלחה.
            message: 'File uploaded successfully',
            filename: req.file.filename // שם הקובץ שהועלה.
        });
    } catch (error) { // טיפול בשגיאות.
        res.status(500).json({ error: error.message }); // החזרת שגיאה.
    }
});

router.post('/image', upload.single('image'), (req, res) => { // מסלול להעלאת תמונה.
    try {
        if (!req.file) { // אם לא הועלתה תמונה.
            return res.status(400).json({ error: 'No image uploaded' }); // החזרת שגיאה.
        }
        res.json({  // תגובה על הצלחה.
            message: 'Image uploaded successfully',
            filename: req.file.filename // שם התמונה שהועלתה.
        });
    } catch (error) { // טיפול בשגיאות.
        res.status(500).json({ error: error.message }); // החזרת שגיאה.
    }
});

export default router; // ייצוא ה-router לשימוש בקובץ אחר.

