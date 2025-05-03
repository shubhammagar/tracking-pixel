const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const app = express();

const Port = 3000;

const trackingEvent = [];

app.get('/pixel', async (req, res) => {
    const id = req.query.id;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const timeStamp = new Date().toISOString();


    let location = {};
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`)
        location ={
            city:response.data.city,
            region:response.data.regionName,
            country:response.data.country,
        }
    }catch(err){
        console.error('Error fetching location:', err);
    }

    const events = await trackingEvent.filter(event => event.id ===id);
    const uniqueIps = new Set(events.map(event => event.ip));
    const unqueAgent = new Set(events.map(event=> event.userAgent));

    if(uniqueIps.size > 1 || unqueAgent.size > 1){
        console.log(`likely forwared email ${id}`)
    }
    console.log(`email opened`);
    console.log(`id: ${id}`);
    console.log(`ip: ${ip}`);
    console.log(`userAgent: ${userAgent}`);
    console.log(`location is ${JSON.stringify(location)}`);
    

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