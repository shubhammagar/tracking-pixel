const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const PORT = 3000;

// In-memory store for tracking events
const trackingEvents = [];

app.get('/pixel', async (req, res) => {
    const trackingId = req.query.id || 'unknown';
    const recipientEmail = req.query.email || 'unknown';
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const timestamp = new Date().toISOString();

    // Fetch geolocation data based on IP
    let location = {};
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        location = {
            city: response.data.city,
            region: response.data.regionName,
            country: response.data.country,
        };
    } catch (err) {
        console.error('Error fetching location:', err);
    }

    // Log the tracking event
    const event = {
        trackingId,
        recipientEmail,
        ip,
        userAgent,
        timestamp,
        location,
    };
    trackingEvents.push(event);

    // Analyze for potential forwarding
    const relatedEvents = trackingEvents.filter(e => e.trackingId === trackingId);
    const uniqueIps = new Set(relatedEvents.map(e => e.ip));
    const uniqueUserAgents = new Set(relatedEvents.map(e => e.userAgent));
    const uniqueEmails = new Set(relatedEvents.map(e => e.recipientEmail));

    if (uniqueIps.size > 1 || uniqueUserAgents.size > 1 || uniqueEmails.size > 1) {
        console.log(`📨 Possible email forwarding detected for ID: ${trackingId}`);
        console.log(`Unique IPs: ${[...uniqueIps].join(', ')}`);
        console.log(`Unique User Agents: ${[...uniqueUserAgents].join(', ')}`);
        console.log(`Unique Emails: ${[...uniqueEmails].join(', ')}`);
    }

    // Log the tracking information
    console.log(`📬 Email Opened`);
    console.log(`Tracking ID: ${trackingId}`);
    console.log(`Recipient Email: ${recipientEmail}`);
    console.log(`IP Address: ${ip}`);
    console.log(`User Agent: ${userAgent}`);
    console.log(`Location: ${JSON.stringify(location)}`);
    console.log(`Timestamp: ${timestamp}`);
    console.log('-----------------------------------');

    // Serve the tracking pixel
    const pixelPath = path.join(__dirname, 'pixel.png');
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(pixelPath, (err) => {
        if (err) {
            console.error('Error sending pixel image:', err);
            res.status(err.status || 500).end();
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});