const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('product_03_dump.html', 'utf8');
const $ = cheerio.load(html);

$('*').each((i, el) => {
    if ($(el).children().length === 0 && $(el).text().trim() === '产品优势') {
        const parent = $(el).parent().parent().parent();
        console.log(parent.text().replace(/\s+/g, ' '));
        console.log('----- HTML -----');
        console.log(parent.html());
    }
});
