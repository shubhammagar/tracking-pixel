const sharp = require('sharp');

sharp({
    create: {
        width:1,
        height:1,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
}).png().toFile('pixel.png').then(() => {
    console.log('Pixel image created successfully');
}
).catch(err => {
    console.error('Error creating pixel image:', err);
});
