const fs = require('fs');
const { execSync } = require('child_process');
const cheerio = require('cheerio');

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function fetchBodyHtml(url) {
    try {
        const cmdHtml = `curl -s -k -L -H "User-Agent: ${USER_AGENT}" "${url}"`;
        let htmlSnippet = execSync(cmdHtml).toString();
        const scriptMatch = htmlSnippet.match(/src=['"]([^'"]+Body\.js[^'"]*)['"]/);
        if (!scriptMatch) return null;

        const scriptUrl = scriptMatch[1].startsWith('http') ? scriptMatch[1] : `https:${scriptMatch[1]}`;
        const cmdJs = `curl -s -k -L -H "User-Agent: ${USER_AGENT}" -H "Referer: ${url}" "${scriptUrl}"`;
        let jsContent = execSync(cmdJs).toString();

        let outHtml = "";
        const fakeDocument = {
            writeln: (str) => { outHtml += str; },
            write: (str) => { outHtml += str; }
        };
        const fakeWindow = { navigator: { userAgent: '' } };
        const sandboxCode = `
            (function(document, window) {
                ${jsContent}
            })(fakeDocument, fakeWindow);
        `;
        eval(sandboxCode);
        return outHtml;
    } catch (e) {
        console.error("fetchBodyHtml error", e.message);
        return null;
    }
}

const html = fetchBodyHtml('https://cs.new.myibc.net/Product_01');
if (html) {
    const $ = cheerio.load(html);
    const texts = [];
    $('.editableContent').each((i, el) => {
        let txt = $(el).text().replace(/\s+/g, ' ').trim();
        if (txt.length > 2) texts.push(`[${i}] ${txt}`);
    });
    console.log("Product_01:", texts.slice(0, 10).join('\n'));
}

const htmlSol = fetchBodyHtml('https://cs.new.myibc.net/Solution_01');
if (htmlSol) {
    const $ = cheerio.load(htmlSol);
    const texts = [];
    $('.editableContent').each((i, el) => {
        let txt = $(el).text().replace(/\s+/g, ' ').trim();
        if (txt.length > 2) texts.push(`[${i}] ${txt}`);
    });
    console.log("\nSolution_01:", texts.slice(0, 10).join('\n'));
}
