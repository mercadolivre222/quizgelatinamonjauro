const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);

$('script').each((i, el) => {
    const src = $(el).attr('src');
    const htmlContent = $(el).html() || '';
    if (src === '/src/main.js' || 
        $(el).attr('id') === '__NEXT_DATA__' || 
        htmlContent.includes('webpackChunk') || 
        htmlContent.includes('__BUILD_MANIFEST') || 
        $(el).attr('id') === 'inlead-global-script' || 
        $(el).attr('defer') !== undefined) {
        $(el).remove();
    }
});

$('.selected').removeClass('selected');
$('.active').removeClass('active');
$('[class*="border-[--opt-borderColor-active]"]').removeClass(function(i, className) {
    return (className.match(/(^|\s)border-\[--opt-borderColor-active\]\S*/g) || []).join(' ');
});

$('button[data-value="todo"]').each((i, el) => {
    if(!$(el).text().trim()) {
        $(el).append('<div><div><div><div></div></div><div><div><p>Todo el cuerpo</p></div></div></div></div>');
    }
});

fs.writeFileSync('index.html', $.html(), 'utf8');
console.log('Cleaned HTML successfully.');
