const fs = require('fs');
const html = fs.readFileSync('slider.html', 'utf8');

// Use regex to find 70 and show 300 characters around it.
const idx = html.indexOf('70<');
if (idx !== -1) {
    console.log("Ruler 70:");
    console.log(html.substring(Math.max(0, idx - 150), idx + 150));
}

// Find big text displaying 70kg
const matches = [...html.matchAll(/<[^>]+>[0-9]{2,3}<[^>]+>kg/gi)];
if (matches.length > 0) {
    console.log("Found big kg:");
    matches.forEach(m => console.log(m[0]));
} else {
    // maybe it's 70<span>kg</span> ?
    const regex2 = /[0-9]{2,3}.{0,50}kg/gi;
    const matches2 = [...html.matchAll(regex2)];
    console.log("Found kg near numbers:");
    matches2.forEach(m => console.log(m[0]));
}
