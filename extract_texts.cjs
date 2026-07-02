const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);

// Remove scripts e styles
$('script, style, noscript').remove();

const texts = new Set();
$('body *').contents().each(function() {
  if (this.nodeType === 3) {
    const text = $(this).text().trim();
    if (text.length > 1 && !text.match(/^[0-9.,]+$/)) {
      texts.add(text);
    }
  }
});

fs.writeFileSync('extracted_texts.json', JSON.stringify(Array.from(texts), null, 2));
console.log('Extração concluída. Total de textos:', texts.size);
