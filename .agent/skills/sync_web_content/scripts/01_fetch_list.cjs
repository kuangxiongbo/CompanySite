
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Config
const REFERER = "https://new.myibc.net/";
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const configPath = path.resolve(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const newsTsPath = path.resolve('/Users/kuangxb/Desktop/CompanySite/data/news.ts');
const uploadDir = path.resolve('/Users/kuangxb/Desktop/CompanySite/public/upload');
const mainListPath = path.resolve('/Users/kuangxb/Desktop/CompanySite/data/main_list.json');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

async function fetchAndProcessList(url) {
    const tempFile = 'list_temp.js';
    console.log(`Fetching list content from: ${url}`);

    const cmd = `curl -s -k -L -H "Referer: ${REFERER}" -H "User-Agent: ${USER_AGENT}" "${url}" > ${tempFile}`;
    try {
        execSync(cmd);
    } catch (e) {
        console.error("Failed to fetch: " + e.message);
        return {};
    }

    let jsContent = fs.readFileSync(tempFile, 'utf8');
    let htmlContent = '';

    const start = jsContent.indexOf("'");
    const end = jsContent.lastIndexOf("'");
    if (start !== -1 && end !== -1) {
        htmlContent = jsContent.substring(start + 1, end)
            .replace(/\\u([0-9a-fA-F]{4})/g, (m, g) => String.fromCharCode(parseInt(g, 16)))
            .replace(/\\r\\n/g, '\n')
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\u003c/g, '<')
            .replace(/\\u003e/g, '>')
            .replace(/\\'/g, "'")
            .replace(/\\\\/g, '\\');
    }

    const itemsMap = {};
    const liRegex = /<li[^>]*data-list-id=["'](\d+)["'][^>]*>([\s\S]*?)<\/li>/g;

    let match;
    while ((match = liRegex.exec(htmlContent)) !== null) {
        const rawId = match[1];
        const id = `news-${rawId}`;
        const blockHtml = match[2];

        const itemData = { id: id };

        let imgSrc = '';
        const picUrlMatch = match[0].match(/data-list-picurl=["']([^"']+)["']/);
        if (picUrlMatch) {
            imgSrc = picUrlMatch[1];
        } else {
            const imgMatch = blockHtml.match(/<img[^>]*src=["']([^"']+)["']/);
            if (imgMatch) imgSrc = imgMatch[1];
        }

        if (imgSrc) {
            if (imgSrc.startsWith('//')) imgSrc = 'https:' + imgSrc;
            itemData.image = imgSrc;
        }

        const titleMatch = blockHtml.match(/<a[^>]*class=["']w-list-titlelink["'][^>]*>([\s\S]*?)<\/a>/);
        if (titleMatch) itemData.title = titleMatch[1].replace(/<[^>]+>/g, '').trim();

        const descMatch = blockHtml.match(/<p[^>]*class=["']w-list-desc[^"']*["'][^>]*>([\s\S]*?)<\/p>/);
        if (descMatch) itemData.summary = descMatch[1].replace(/<[^>]+>/g, '').trim();

        itemsMap[id] = itemData;
    }

    fs.unlinkSync(tempFile);
    return itemsMap;
}

async function run() {
    const allItems = await fetchAndProcessList(config.source.listUrl);
    console.log(`Found ${Object.keys(allItems).length} items in the main list page.`);

    // Save for unify script
    fs.writeFileSync(mainListPath, JSON.stringify(allItems, null, 2));
    console.log(`Saved metadata to ${mainListPath}`);
}

run();
