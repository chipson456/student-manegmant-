import mongoose from 'mongoose';

// סכימת המשתמש
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // שם משתמש ייחודי
    password: { type: String, required: true }, // סיסמה
    email: { type: String, unique: true, required: true }, // אימייל ייחודי
    phone: { type: String, unique: true }, // טלפון ייחודי
    role: { type: String, default: 'student' }, // תפקיד (student, admin)
}, {
    timestamps: true, // מוסיף שדות createdAt ו-updatedAt
});

// יצירת מודל המשתמש
const User = mongoose.model('User', userSchema);

export default User;
