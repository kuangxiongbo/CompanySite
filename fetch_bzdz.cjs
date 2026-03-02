const fs = require('fs');
const { execSync } = require('child_process');

const url = "https://cs.new.myibc.net/bzdz";
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

try {
    console.log("Fetching HTML...");
    const cmdHtml = `curl -s -k -L -H "User-Agent: ${USER_AGENT}" "${url}"`;
    let html = execSync(cmdHtml).toString();

    const scriptMatch = html.match(/src=['"]([^'"]+Body\.js[^'"]*)['"]/);
    if (!scriptMatch) {
        console.error("No Body.js found");
        process.exit(1);
    }

    const scriptUrl = scriptMatch[1].startsWith('http') ? scriptMatch[1] : `https:${scriptMatch[1]}`;
    console.log("Fetching Body Component: " + scriptUrl);

    const cmdJs = `curl -s -k -L -H "User-Agent: ${USER_AGENT}" -H "Referer: ${url}" "${scriptUrl}"`;
    let jsContent = execSync(cmdJs).toString();

    const start = jsContent.indexOf("'");
    const end = jsContent.lastIndexOf("'");
    if (start === -1 || end <= start) {
        console.error("Failed to parse JS content");
        process.exit(1);
    }

    const rawContent = jsContent.substring(start + 1, end);
    const content = unescapeJs(rawContent);

    fs.writeFileSync('bzdz_body.html', content);
    console.log("Saved unescaped HTML to bzdz_body.html");
} catch (e) {
    console.error("Error:", e.message);
}
