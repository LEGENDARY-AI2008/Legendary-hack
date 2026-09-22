const express = require('express');
const app = express();

app.use(express.json());

let keys = {};

function generateRandomKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'LEGEND-';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

app.post('/generate', (req, res) => {
    const newKey = generateRandomKey();
    const now = Date.now();
    keys[newKey] = { createdAt: now, expiresAt: now + (5 * 60 * 60 * 1000), status: 'active' };
    res.json({ key: newKey });
});

app.post('/verify', (req, res) => {
    const { key } = req.body;
    const now = Date.now();
    if (keys[key]) {
        if (keys[key].status === 'active' && keys[key].expiresAt > now) {
            return res.json({ status: 'valid', message: 'Access Granted' });
        } else {
            return res.json({ status: 'expired', message: 'Key has expired' });
        }
    }
    return res.json({ status: 'invalid', message: 'Key not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log('Server is running...'); });
