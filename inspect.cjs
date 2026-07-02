const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);

// Mostrar como é o HTML do back button (qualquer a ou svg no topo)
console.log("--- Back Buttons ---");
$('a').each((i, el) => {
    if($(el).html().includes('svg') || $(el).attr('href')) {
        console.log($(el).attr('href'), $(el).attr('onclick'), $(el).attr('class'));
    }
});

// Mostrar como é a estrutura das opções do quiz e do botão Continuar na primeira pergunta (step 2)
console.log("--- Quiz Options Step 2 ---");
if ($('#step-2').length) {
    console.log($('#step-2').html().substring(0, 800));
}

// E do botão Continuar
console.log("--- Botão Continuar ---");
if ($('#step-2').length) {
    $('#step-2 button, #step-2 a, #step-2 div[onclick]').each((i, el) => {
        console.log("Elemento clicável:", $(el).prop('tagName'), $(el).attr('onclick'), $(el).text().trim().substring(0, 50));
    });
}
