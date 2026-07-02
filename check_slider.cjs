const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);

const sliderTitle = $('*:contains("Historias de Transformaci")').last();
const stepDiv = sliderTitle.closest('div[id^="step-"]');
console.log("Slider Step ID:", stepDiv.attr('id'));
console.log(stepDiv.html().substring(0, 1000));

// Find slider elements
const images = stepDiv.find('img');
console.log("Images found:", images.length);
