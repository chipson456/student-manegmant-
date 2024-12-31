import express from 'express'; // ייבוא ספריית express ליצירת מסלול HTTP.
const router = express.Router(); // יצירת אובייקט router לניהול מסלולים.

router.get('/', (req, res) => { // מסלול GET לבדיקת תקינות השרת.
    res.status(200).send('Server is running'); // שליחת תגובה מוצלחת עם הודעה.
});

// Route for login
router.post('/login', (req, res) => { // מסלול POST לטיפול בהתחברות משתמשים.
    const { username, password } = req.body; // חילוץ שם משתמש וסיסמה מהבקשה.

    // Example: hardcoded users
    const users = [ // רשימת משתמשים עם סיסמאות מוגדרות מראש.
        { username: 'admin', password: 'admin123' }, // משתמש עם שם משתמש וסיסמה.
        { username: 'user', password: 'user123' },   // משתמש נוסף לדוגמה.
    ];

    console.log('Received login request:', username, password); // בדיקה
    const user = users.find((u) => u.username === username && u.password === password); // בדיקת התאמה בין המשתמשים בבקשה למשתמשים ברשימה.
    if (user) { // אם המשתמש נמצא ברשימה.
        console.log('Login successful'); // בדיקה

        res.status(200).json({ token: 'valid-token' }); // החזרת תגובה עם אסימון תקין.
    } else { // אם המשתמש לא נמצא.
        console.log('Login failed'); // בדיקה
        res.status(401).json({ error: 'Invalid username or password' }); // החזרת שגיאה עם הודעה.
    }
});

export default router; // ייצוא ה-router לשימוש בקובץ אחר.
