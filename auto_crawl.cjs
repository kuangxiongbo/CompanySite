const fs = require('fs');
const { execSync } = require('child_process');
const cheerio = require('cheerio');
const path = require('path');

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const CACHE_DIR = path.join(__dirname, '.crawl_cache');
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

function safeExec(cmd) {
    try {
        return execSync(cmd).toString();
    } catch (e) {
        return "";
    }
}

function fetchPage(url) {
    const cacheFile = path.join(CACHE_DIR, Buffer.from(url).toString('base64') + '.html');
    if (fs.existsSync(cacheFile)) return fs.readFileSync(cacheFile, 'utf8');

    const cmdHtml = `curl -s -k -L -H "User-Agent: ${USER_AGENT}" "${url}"`;
    let htmlSnippet = safeExec(cmdHtml);
    const scriptMatch = htmlSnippet.match(/src=['"]([^'"]+Body\.js[^'"]*)['"]/);
    if (!scriptMatch) return htmlSnippet;

    const scriptUrl = scriptMatch[1].startsWith('http') ? scriptMatch[1] : `https:${scriptMatch[1]}`;
    const cmdJs = `curl -s -k -L -H "User-Agent: ${USER_AGENT}" -H "Referer: ${url}" "${scriptUrl}"`;
    let jsContent = safeExec(cmdJs);
    if (!jsContent) return "";
    let outHtml = "";
    const fakeDocument = {
        writeln: (str) => { outHtml += str; },
        write: (str) => { outHtml += str; }
    };
    const fakeWindow = { navigator: { userAgent: '' } };
    try {
        eval(`(function(document, window) { ${jsContent} })(fakeDocument, fakeWindow);`);
        fs.writeFileSync(cacheFile, outHtml);
        return outHtml;
    } catch (e) {
        return "";
    }
}

function parseProduct(url) {
    const html = fetchPage(url);
    if (!html) return null;
    const $ = cheerio.load(html);

    const texts = [];
    $('.editableContent').each((i, el) => {
        let txt = $(el).text().replace(/\s+/g, ' ').trim();
        if (txt.length > 2) texts.push(txt);
    });

    let mainImg = "";
    $('img').each((i, el) => {
        let src = $(el).attr('src');
        if (src && (src.includes('upload/') || src.includes('sitefiles')) && !src.includes('logo')) {
            mainImg = src;
            return false;
        }
    });

    // Very simple heuristic to map array of strings
    let txtArray = [...new Set(texts)].slice(10); // Skip header menu
    let content = txtArray.join(" | ");

    return {
        id: url.split('/').pop(),
        title: txtArray[1] || "",
        subtitle: txtArray[2] || "",
        content: content,
        raw_image: mainImg
    };
}

const products = [];
[...Array(40).keys()].forEach(i => {
    let num = (i + 1).toString().padStart(2, '0');
    console.log(`Fetching Product_${num}...`);
    let prod = parseProduct(`https://cs.new.myibc.net/Product_${num}`);
    if (prod) products.push(prod);
});

fs.writeFileSync('extracted_products.json', JSON.stringify(products, null, 2));
console.log("Done.");
