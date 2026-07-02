const fs = require('fs');
const cheerio = require('cheerio');

const map = {
  "Você está lutando contra": "¿Estás luchando contra",
  "Barriga Estufada": "Abdomen hinchado",
  "Gordura Localizada": "Grasa localizada",
  "Descubra como ativar seu metabolismo e perder até": "Descubre cómo activar tu metabolismo y perder hasta",
  "12kg em 30 dias": "12 kg en 30 días",
  "com a": "con la",
  "Gelatina Mounjaro": "Gelatina Mounjaro",
  "Quero saber se funciona para mim! 🔥": "¡Quiero saber si funciona para mí! 🔥",
  "Qual a sua idade?": "¿Cuál es tu edad?",
  "Selecione sua faixa etária.": "Selecciona tu rango de edad.",
  "18 - 27 anos": "18 - 27 años",
  "28 - 39 anos": "28 - 39 años",
  "40 - 54 anos": "40 - 54 años",
  "54+ anos": "54+ años",
  "Como você classifica": "¿Cómo clasificas",
  "o seu corpo?": "tu cuerpo?",
  "Selecione a opção que melhor te descreve": "Selecciona la opción que mejor te describe",
  "Médio": "Medio",
  "Plus Size": "Talla grande",
  "Acima do Peso": "Sobrepeso",
  "Sobrepeso": "Sobrepeso",
  "Quais as áreas que você mais quer perder gordura?": "¿En qué áreas quieres perder grasa?",
  "Selecione todas que se aplicam.": "Selecciona todas las que apliquen.",
  "Culotes": "Cartucheras",
  "Braços": "Brazos",
  "Barriga": "Abdomen",
  "Coxas": "Muslos",
  "Glúteos": "Glúteos",
  "Corpo todo": "Todo el cuerpo",
  "Continuar": "Continuar",
  "Sim, até as famosas estão usando! ⭐": "¡Sí, hasta las famosas lo están usando! ⭐",
  "A Gelatina Mounjaro é tendência entre celebridades e influenciadoras.": "La Gelatina Mounjaro es tendencia entre celebridades e influencers.",
  "VEJA COMO FUNCIONA O": "¡MIRA CÓMO FUNCIONA EL",
  "TRUQUE DA GELATINA!": "TRUCO DE LA GELATINA!",
  "Qual é o seu nome?": "¿Cuál es tu nombre?",
  "Para personalizarmos sua experiência.": "Para personalizar tu experiencia.",
  ", como o peso afeta sua vida?": ", ¿cómo afecta el peso tu vida?",
  "Entender isso nos ajuda a criar seu protocolo ideal": "Entender esto nos ayuda a crear tu protocolo ideal",
  "Afeta minha autoestima": "Afecta mi autoestima",
  "Me sinto insegura com meu corpo": "Me siento insegura con mi cuerpo",
  "Afeta minha saúde": "Afecta mi salud",
  "Sinto cansaço, dores e falta de energia": "Siento cansancio, dolores y falta de energía",
  "Afeta meus relacionamentos": "Afecta mis relaciones",
  "Evito encontros e situações sociais": "Evito encuentros y situaciones sociales",
  "Afeta minha rotina": "Afecta mi rutina",
  "Dificuldade em fazer tarefas simples": "Dificultad para hacer tareas simples",
  "Você está feliz com sua aparência atual?": "¿Estás contenta con tu apariencia actual?",
  "Seja sincera consigo mesma": "Sé sincera contigo misma",
  "Não estou feliz": "No estoy feliz",
  "Poderia ser melhor": "Podría ser mejor",
  "Estou trabalhando nisso": "Estoy trabajando en ello",
  "O que te impede de emagrecer?": "¿Qué te impide adelgazar?",
  "Selecione todas as barreiras que você enfrenta": "Selecciona todas las barreras que enfrentas",
  "Falta de tempo": "Falta de tiempo",
  "Falta de autocontrole": "Falta de autocontrol",
  "Questões financeiras": "Cuestiones financieras",
  "Falta de constância": "Falta de constancia",
  "O que você quer conquistar?": "¿Qué quieres lograr?",
  "Selecione seus maiores objetivos": "Selecciona tus mayores objetivos",
  "Ter mais energia": "Tener más energía",
  "Usar roupas que amo": "Usar ropa que amo",
  "Melhorar autoestima": "Mejorar la autoestima",
  "Ter mais Saúde": "Tener más Salud",
  "Me Sentir mais Leve": "Sentirme más ligera",
  "Receber elogios": "Recibir cumplidos",
  "Ótimo,! 🎉": "¡Genial,! 🎉",
  "Sem esforço ou dietas chatas: a Gelatina Mounjaro faz o trabalho pesado por você, ativando a queima de gordura com ingredientes caseiros que você prepara em minutos.": "Sin esfuerzo ni dietas aburridas: la Gelatina Mounjaro hace el trabajo pesado por ti, activando la quema de grasa con ingredientes caseros que preparas en minutos.",
  "Como funciona:": "Cómo funciona:",
  "A receita caseira ativa o GLP-1, o mesmo hormônio que faz o efeito do Mounjaro, mas de forma 100% natural!": "La receta casera activa el GLP-1, el mismo factor que causa el efecto del Mounjaro, ¡pero de forma 100% natural!",
  "Entendi! Continuar 🚀": "¡Entendido! Continuar 🚀",
  "Qual é seu peso atual?": "¿Cuál es tu peso actual?",
  "Seja sincera para um resultado preciso": "Sé sincera para un resultado preciso",
  "Arraste para ajustar": "Arrastra para ajustar",
  "Qual é sua altura?": "¿Cuál es tu altura?",
  "Precisamos disso para calcular seu IMC": "Necesitamos esto para calcular tu IMC",
  "Qual é seu peso desejado?": "¿Cuál es tu peso deseado?",
  "Qual o peso que você sonha alcançar?": "¿Qué peso sueñas alcanzar?",
  "Quantas gestações você já teve?": "¿Cuántos embarazos has tenido?",
  "Isso ajuda a personalizar seu plano.": "Esto ayuda a personalizar tu plan.",
  "Nunca estive grávida": "Nunca estuve embarazada",
  "1 gestação": "1 embarazo",
  "2 gestações": "2 embarazos",
  "3 ou mais gestações": "3 o más embarazos",
  "Como é sua rotina diária?": "¿Cómo es tu rutina diaria?",
  "Selecione a que mais se encaixa.": "Selecciona la que más encaja.",
  "Trabalho fora de casa": "Trabajo fuera de casa",
  "Trabalho em home office": "Trabajo desde casa",
  "Cuido da casa/família": "Cuido la casa/familia",
  "Estudo": "Estudio",
  "Quantas horas você dorme por noite?": "¿Cuántas horas duermes por noche?",
  "O sono é essencial para o emagrecimento.": "El sueño es esencial para adelgazar.",
  "Menos de 5 horas": "Menos de 5 horas",
  "5 a 7 horas": "5 a 7 horas",
  "7 a 9 horas": "7 a 9 horas",
  "Mais de 9 horas": "Más de 9 horas",
  "Quanta água você bebe por dia?": "¿Cuánta agua bebes por día?",
  "A hidratação acelera resultados.": "La hidratación acelera los resultados.",
  "Quase nada": "Casi nada",
  "Menos de 1 litro": "Menos de 1 litro",
  "1 a 2 litros": "1 a 2 litros",
  "Mais de 2 litros": "Más de 2 litros",
  "Resultado da sua análise,": "Resultado de tu análisis,",
  "O segredo para secar:": "El secreto para secar:",
  "não é comer menos, é ativar o GLP-1. A": "no es comer menos, es activar el GLP-1. La",
  "atua como um \"interruptor\" hormonal natural!": "¡actúa como un \"interruptor\" hormonal natural!",
  "\"Perdi 12kg em 5 semanas!\"": "\"¡Perdí 12kg en 5 semanas!\"",
  "Maria, 32 anos - São Paulo": "María, 32 años - Santiago",
  "Como usar a": "Cómo usar la",
  "Simples, prático e eficaz": "Simple, práctico y eficaz",
  "✅ Sim, eu me comprometo!": "✅ ¡Sí, me comprometo!",
  "Analisando seu perfil....": "Analizando tu perfil....",
  "Criando as melhores receitas...": "Creando las mejores recetas...",
  "Qual o corpo dos seus sonhos?": "¿Cuál es el cuerpo de tus sueños?",
  "Escolha sua meta.": "Elige tu meta.",
  "Em forma e definida": "En forma y definida",
  "Natural e saudável": "Natural y saludable",
  ", você gostaria de perder entre": ", ¿te gustaría perder entre",
  "11 kilos": "11 kilos",
  "em poucas semanas?": "en pocas semanas?",
  "Baseado no seu perfil, esse resultado é totalmente alcançável com a Gelatina Mounjaro!": "Basado en tu perfil, ¡este resultado es totalmente alcanzable con la Gelatina Mounjaro!",
  "SIM! Quero essa transformação! 🔥": "¡SÍ! ¡Quiero esta transformación! 🔥",
  "Histórias de Transformação": "Historias de Transformación",
  "Veja quem já transformou o corpo com a Gelatina Mounjaro": "Mira quién ya ha transformado su cuerpo con la Gelatina Mounjaro",
  "\"Bizarro... Perdi 7kg em 3 semanas!\"": "\"¡Increíble... Perdí 7kg en 3 semanas!\"",
  "Giovanna, 34 - São Paulo": "Giovanna, 34 - Bogotá",
  "\"Minha barriga sumiu! Não acredito!\"": "\"¡Mi abdomen desapareció! ¡No lo puedo creer!\"",
  "Sandra, 39 - Rio de Janeiro": "Sandra, 39 - Medellín",
  "\"Voltei a usar minhas roupas antigas!\"": "\"¡Volví a usar mi ropa antigua!\"",
  "Cláudia, 35 - Belo Horizonte": "Claudia, 35 - Lima",
  "\"Quem usa tem resultado 😍🙌\"": "\"Quien lo usa, obtiene resultados 😍🙌\"",
  "Patrícia, 31 - Curitiba": "Patricia, 31 - Buenos Aires",
  "ANALISANDO SUAS RESPOSTAS....": "ANALIZANDO TUS RESPUESTAS....",
  "fazendo o melhor plano personalizado pra você......": "creando el mejor plan personalizado para ti......"
};

const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);

// Traduz os textos text nodes
$('body *').contents().each(function() {
  if (this.nodeType === 3) {
    const text = $(this).text().trim();
    if (map[text]) {
      this.data = this.data.replace(text, map[text]);
    }
  }
});

// Trocar também placeholders (se existirem)
$('input').each(function() {
    if ($(this).attr('placeholder') && map[$(this).attr('placeholder')]) {
        $(this).attr('placeholder', map[$(this).attr('placeholder')]);
    }
});

// Encontrar a primeira imagem visível e trocar a fonte para /hero_es.jpeg
const firstImg = $('img').first();
if (firstImg.length) {
    firstImg.attr('src', '/hero_es.jpeg');
    // remover srcset se existir para forçar a usar a src normal
    firstImg.removeAttr('srcset');
}

fs.writeFileSync('index.html', $.html(), 'utf8');
console.log('Tradução e imagem hero aplicados!');
