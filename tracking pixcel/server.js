const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const Port = 3000;

app.get('/pixel', (req, res) => {
    const id = req.query.id;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    console.log(`email opened`);
    console.log(`id: ${id}`);
    console.log(`ip: ${ip}`);
    console.log(`userAgent: ${userAgent}`);

    const pixelPath = path.join(__dirname, 'pixel.png');

    res.setHeader('Content-Type', 'image/png');
    res.sendFile(pixelPath, (err) => {
        if (err) {
            console.error('Error sending pixel image:', err);
            res.status(err.status).end();
        }
    });
    res.setHeader('Cache-Control', 'no-cache');

})

app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
}
);