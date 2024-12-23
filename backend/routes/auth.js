const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('Server is running');
});

// Route for login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Example: hardcoded users
    const users = [
        { username: 'admin', password: 'admin123' }, // Ensure this matches the credentials used in Login.jsx
        { username: 'user', password: 'user123' },   // Add more users if needed
    ];

    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
        res.status(200).json({ token: 'valid-token' });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

module.exports = router;

