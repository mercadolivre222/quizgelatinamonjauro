const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);
let found = '';
$('div[id^="step-"]').each((i, el) => {
    const text = $(el).text();
    if (text.includes('peso actual')) {
        found = $(el).html();
    }
});
fs.writeFileSync('slider.html', found, 'utf8');
console.log('Saved slider.html');
