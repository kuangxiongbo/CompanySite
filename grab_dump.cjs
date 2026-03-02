const fs = require('fs');
const { execSync } = require('child_process');
const cheerio = require('cheerio');

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function fetchBodyText(url) {
    try {
        const cmdHtml = `curl -s -k -L -H "User-Agent: ${USER_AGENT}" "${url}"`;
        let htmlSnippet = execSync(cmdHtml).toString();
        const scriptMatch = htmlSnippet.match(/src=['"]([^'"]+Body\.js[^'"]*)['"]/);
        if (!scriptMatch) return [];

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

        const $ = cheerio.load(outHtml);
        const texts = [];
        $('.editableContent').each((i, el) => {
            let txt = $(el).text().replace(/\s+/g, ' ').trim();
            if (txt.length > 2) texts.push(txt);
        });
        return [...new Set(texts)].slice(10); // Skip the first 10 nav entries mostly
    } catch (e) {
        return [];
    }
}

console.log("=== Product_01 ===");
console.log(fetchBodyText('https://cs.new.myibc.net/Product_01').join(' | '));

console.log("\n=== Product_10 ===");
console.log(fetchBodyText('https://cs.new.myibc.net/Product_10').join(' | '));

console.log("\n=== Solution_01 ===");
console.log(fetchBodyText('https://cs.new.myibc.net/Solution_01').join(' | '));
