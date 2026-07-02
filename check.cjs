const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);

// Step 2 buttons
console.log("Step 2 clickables:");
$('#step-2 button, #step-2 a, #step-2 [role="button"], #step-2 .option-background-default').each((i, el) => {
    console.log($(el).prop('tagName'), $(el).attr('class'), $(el).text().trim().substring(0, 30));
});

// Back buttons
console.log("\nBack buttons:");
$('button:has(svg[data-icon="arrowLeft"])').each((i, el) => {
    console.log("Found back button in step", $(el).closest('div[id^="step-"]').attr('id'));
});
