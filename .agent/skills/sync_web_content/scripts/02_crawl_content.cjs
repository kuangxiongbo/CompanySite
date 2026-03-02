
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Config
const REFERER = "https://new.myibc.net/";
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const targetsPath = path.resolve('/Users/kuangxb/Desktop/CompanySite/data/main_list.json');
const outputPath = path.resolve('/Users/kuangxb/Desktop/CompanySite/data/news_batch_content.json');
const uploadDir = path.resolve('/Users/kuangxb/Desktop/CompanySite/public/upload');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(targetsPath)) {
    console.log("No main_list.json found. Run fetch_list first.");
    process.exit(0);
}

const mainList = JSON.parse(fs.readFileSync(targetsPath, 'utf8'));
// Convert mainList object to array of URLs
const urls = Object.keys(mainList).map(id => {
    const numericId = id.replace('news-', '');
    return `https://new.myibc.net/newsinfo/${numericId}.html`;
});

const results = [];

console.log(`Starting ROBUST crawl for ${urls.length} visible articles...`);

function downloadImage(url) {
    if (!url) return '';
    if (url.startsWith('//')) url = 'https:' + url;
    let filename = path.basename(url.split('?')[0]);
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    if (!filename.match(/\.(jpg|png|jpeg|gif|webp)$/i)) filename += '.jpg';

    const localPath = path.join(uploadDir, filename);
    const publicPath = `/upload/${filename}`;

    if (!fs.existsSync(localPath)) {
        console.log(`    - [Downloading Image] ${url}`);
        const cmd = `curl -s -k -L -H "Referer: ${REFERER}" -H "User-Agent: ${USER_AGENT}" -o "${localPath}" "${url}"`;
        try {
            execSync(cmd);
        } catch (e) {
            console.error(`    - [Error] Failed to download image: ${e.message}`);
            return url;
        }
    }
    return publicPath;
}

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

for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`[${i + 1}/${urls.length}] ${url}`);

    try {
        // 1. Get HTML to find Body.js
        const cmdHtml = `curl -s -k -L -m 10 -H "User-Agent: ${USER_AGENT}" "${url}"`;
        let html = execSync(cmdHtml).toString();

        const scriptMatch = html.match(/src=['"]([^'"]+Body\.js[^'"]*)['"]/);
        if (!scriptMatch) {
            console.error("  - [Warning] No Body.js found in HTML loader");
            continue;
        }

        const scriptUrl = scriptMatch[1];

        // 2. Fetch Body.js
        const cmdJs = `curl -s -k -L -m 20 -H "User-Agent: ${USER_AGENT}" -H "Referer: ${url}" "${scriptUrl}"`;
        let jsContent = execSync(cmdJs).toString();

        // 3. Extract and Unescape
        const start = jsContent.indexOf("'");
        const end = jsContent.lastIndexOf("'");
        if (start === -1 || end <= start) {
            console.error("  - [Error] Failed to parse JS content");
            continue;
        }

        const rawContent = jsContent.substring(start + 1, end);
        const content = unescapeJs(rawContent);

        // 4. Extract Items
        const idMatch = url.match(/newsinfo\/(\d+)\.html/);
        const id = idMatch ? `news-${idMatch[1]}` : `news-${Date.now()}`;

        // Title
        let title = "无标题";
        const titleMatch = content.match(/<h\d[^>]*class=["'].*?w-detail-title.*?["'][^>]*>([\s\S]*?)<\/h\d>/) ||
            content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
        if (titleMatch) title = titleMatch[1].replace(/<[^>]+>/g, '').trim();

        // Date
        let date = "";
        const dateMatch = content.match(/<span[^>]*class=["'].*?w-detail-date.*?["'][^>]*>([\s\S]*?)<\/span>/) ||
            content.match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) date = dateMatch[1].replace(/<[^>]+>/g, '').trim();

        // Main Content Selection
        let mainContent = "";
        const contentMatch = content.match(/<div[^>]*class=["'].*?w-detail-content.*?["'][^>]*>([\s\S]*?)<\/div>/) ||
            content.match(/<div[^>]*class=["'].*?w-detailcontent.*?["'][^>]*>([\s\S]*?)<\/div>/);
        if (contentMatch) mainContent = contentMatch[1].trim();

        // Summary (first paragraph of main content)
        let summary = "";
        if (mainContent) {
            const pMatch = mainContent.match(/<p[^>]*>([\s\S]*?)<\/p>/);
            if (pMatch) summary = pMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 200);
        }
        if (!summary) {
            const pMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/);
            if (pMatch) summary = pMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 200);
        }

        // Image (Use first large image in main content)
        let image = "";
        const blacklist = ['ga_icon', 'logo', 'qrcode', '44817906', '44839435', 'spacer'];
        if (mainContent) {
            const imgMatches = mainContent.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
            for (const m of imgMatches) {
                const src = m[1];
                if (!blacklist.some(b => src.includes(b))) {
                    image = downloadImage(src);
                    break;
                }
            }
        }

        results.push({
            id,
            url,
            title,
            date,
            summary,
            image,
            chunks: [{ type: 'html', content: mainContent, tag: 'div' }]
        });

        console.log(`  - [Success] Extracted: ${title}`);

    } catch (e) {
        console.error(`  - [Error] Unexpected: ${e.message}`);
    }
}

fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`Done. Saved ${results.length} items to ${outputPath}`);
