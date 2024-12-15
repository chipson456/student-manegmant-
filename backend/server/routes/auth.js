const express = require('express');
const router = express.Router();


app.get('/', (req, res) => {
    res.status(200).send('Server is running');
});

// Route for login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Example: hardcoded users
    const users = [
        { username: 'admin', password: 'admin123' },
    ];

    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
        res.status(200).json({ token: 'valid-token' });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

module.exports = router;
