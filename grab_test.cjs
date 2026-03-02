const fs = require('fs');
const { execSync } = require('child_process');
const cheerio = require('cheerio');

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function unescapeJs(str) {
    return str
        .replace(/\\u([0-9a-fA-F]{4})/g, (m, g) => String.fromCharCode(parseInt(g, 16)))
        .replace(/\\r\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\u003c/g, '<')
        .replace(/\\u003e/g, '>')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, '\\');
}

function fetchBodyHtml(url) {
    try {
        const cmdHtml = `curl -s -k -L -H "User-Agent: ${USER_AGENT}" "${url}"`;
        let html = execSync(cmdHtml).toString();
        const scriptMatch = html.match(/src=['"]([^'"]+Body\.js[^'"]*)['"]/);
        if (!scriptMatch) return null;

        const scriptUrl = scriptMatch[1].startsWith('http') ? scriptMatch[1] : `https:${scriptMatch[1]}`;
        const cmdJs = `curl -s -k -L -H "User-Agent: ${USER_AGENT}" -H "Referer: ${url}" "${scriptUrl}"`;
        let jsContent = execSync(cmdJs).toString();

        const start = jsContent.indexOf("'");
        const end = jsContent.lastIndexOf("'");
        if (start === -1 || end <= start) return null;

        return unescapeJs(jsContent.substring(start + 1, end));
    } catch (e) {
        return null;
    }
}

const html = fetchBodyHtml('https://cs.new.myibc.net/Product_01');
if (html) {
    fs.writeFileSync('temp_prod01.html', html);
    const $ = cheerio.load(html);

    // Dump typical elements to find selectors
    console.log("Features:");
    $('.Mod1_div_Text_Title').each((i, el) => console.log($(el).text().trim()));

    console.log("Desc:");
    console.log($('.Mod1_div_top_p').text().trim() || $('.Mod3_div_p').text().trim());

    console.log("Advantages:");
    $('.Mod2_div_right_Title').each((i, el) => console.log($(el).text().trim()));
}

const htmlSol = fetchBodyHtml('https://cs.new.myibc.net/Solution_01');
if (htmlSol) {
    fs.writeFileSync('temp_sol01.html', htmlSol);
}
