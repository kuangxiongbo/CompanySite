const cheerio = require('cheerio');
const fs = require('fs');
const html = fs.readFileSync('temp_prod01.html', 'utf8');
const $ = cheerio.load(html);
const texts = [];
$('.w-text').each((i, el) => {
    texts.push($(el).text().replace(/\s+/g, ' ').trim());
});
console.log(texts.filter(t => t.length > 5).join('\n'));
