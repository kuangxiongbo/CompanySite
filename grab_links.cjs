const { execSync } = require('child_process');
const cheerio = require('cheerio');
const fs = require('fs');

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function fetchHtml(url) {
    const cmdHtml = `curl -s -k -L -H "User-Agent: ${USER_AGENT}" "${url}"`;
    let htmlSnippet = execSync(cmdHtml).toString();
    const scriptMatch = htmlSnippet.match(/src=['"]([^'"]+Body\.js[^'"]*)['"]/);
    if (!scriptMatch) return htmlSnippet; // Maybe not smart design

    const scriptUrl = scriptMatch[1].startsWith('http') ? scriptMatch[1] : `https:${scriptMatch[1]}`;
    const cmdJs = `curl -s -k -L -H "User-Agent: ${USER_AGENT}" -H "Referer: ${url}" "${scriptUrl}"`;
    let jsContent = execSync(cmdJs).toString();

    let outHtml = "";
    const fakeDocument = {
        writeln: (str) => { outHtml += str; },
        write: (str) => { outHtml += str; }
    };
    const fakeWindow = { navigator: { userAgent: '' } };
    eval(`(function(document, window) { ${jsContent} })(fakeDocument, fakeWindow);`);
    return outHtml;
}

const $ = cheerio.load(fetchHtml('https://cs.new.myibc.net/Product'));
const links = [];
$('a').each((i, el) => {
    let href = $(el).attr('href');
    if (href && href.includes('Product_')) links.push(href);
});

console.log([...new Set(links)]);
