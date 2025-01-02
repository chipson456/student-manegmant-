import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('Server is running');
});

// Route for login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Example: hardcoded users
    const users = [
        { username: 'admin', password: 'admin123' },
        { username: 'user', password: 'user123' },
    ];

    console.log('Received login request:', username, password);
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
        console.log('Login successful');
        res.status(200).json({ token: 'valid-token' });
    } else {
        console.log('Login failed');
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

export default router;
