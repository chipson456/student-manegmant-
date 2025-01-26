import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Middleware לאימות משתמש
export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // שליפת הטוקן מהכותרות

    if (!token) {
        return res.status(401).json({ message: 'אין גישה, אנא התחבר תחילה.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // פיענוח הטוקן
        req.user = decoded; // הוספת המידע של המשתמש ל-request
        next();
    } catch (err) {
        res.status(403).json({ message: 'טוקן לא תקין או פג תוקף.' });
    }
};

// Middleware לבדיקת הרשאות מנהל
export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'גישה נדחתה. רק למנהלים יש גישה.' });
    }
    next();
};
