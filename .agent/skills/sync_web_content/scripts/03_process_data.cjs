
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REFERER = "https://new.myibc.net/";
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const sitemapDataPath = path.resolve('/Users/kuangxb/Desktop/CompanySite/data/news_batch_content.json');
const mainListPath = path.resolve('/Users/kuangxb/Desktop/CompanySite/data/main_list.json');
const newsTsPath = path.resolve('/Users/kuangxb/Desktop/CompanySite/data/news.ts');
const uploadDir = path.resolve('/Users/kuangxb/Desktop/CompanySite/public/upload');

if (!fs.existsSync(sitemapDataPath)) {
    console.error(`Sitemap data not found: ${sitemapDataPath}`);
    process.exit(1);
}

const sitemapData = JSON.parse(fs.readFileSync(sitemapDataPath, 'utf8'));

let mainListMap = {};
if (fs.existsSync(mainListPath)) {
    try {
        mainListMap = JSON.parse(fs.readFileSync(mainListPath, 'utf8'));
    } catch (e) { console.error("Could not parse main_list.json, ignoring."); }
}

const crypto = require('crypto');

const MOBILE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1";

function downloadImage(url) {
    if (!url) return '';
    if (url.startsWith('//')) url = 'https:' + url;
    if (!url.startsWith('http')) return url;

    let base = path.basename(url.split('?')[0]).replace(/[^a-zA-Z0-9._-]/g, '_');

    // Check for generic names or WeChat images
    const isGeneric = base.length < 5 || base === '640' || base === 'image' || url.includes('mmbiz') || url.includes('135editor');

    if (isGeneric) {
        const hash = crypto.createHash('md5').update(url).digest('hex').substring(0, 8);
        const extMatch = url.match(/wx_fmt=([a-z]+)/i);
        let ext = extMatch ? '.' + extMatch[1].toLowerCase() : '';
        if (!ext) {
            const currentExt = base.match(/\.(jpg|png|jpeg|gif|webp)$/i);
            ext = currentExt ? currentExt[0] : '.jpg';
        }
        base = base.split('.')[0] + '_' + hash + ext;
    }

    if (!base.match(/\.(jpg|png|jpeg|gif|webp)$/i)) base += '.jpg';

    const localPath = path.join(uploadDir, base);
    const publicPath = `/upload/${base}`;

    // Verify existing file is not a 403 Forbidden page (typically 238 bytes)
    if (fs.existsSync(localPath)) {
        const stats = fs.statSync(localPath);
        if (stats.size > 1000) return publicPath;
        // If it's too small, it's likely broken, so we re-download
        console.log(`  - [Re-download] File ${base} is too small (${stats.size}b), likely 403. Trying with Mobile UA...`);
    }

    console.log(`  - [New Image] Downloading: ${url} -> ${base}`);
    // Try first with standard UA, then Mobile UA if Referer check is strict
    const cmd = `curl -s -k -L -H "Referer: ${REFERER}" -H "User-Agent: ${MOBILE_UA}" -o "${localPath}" "${url}"`;
    try {
        execSync(cmd);
        if (fs.existsSync(localPath)) {
            const stats = fs.statSync(localPath);
            if (stats.size < 1000) {
                console.error(`    - Download for ${url} still small (${stats.size}b) after download.`);
            }
        }
    } catch (e) {
        console.error(`    - Error downloading ${url}: ${e.message}`);
        return url;
    }
    return publicPath;
}

function cleanString(str) {
    if (!str) return "";
    return str
        .replace(/\\n/g, ' ')
        .replace(/\\r/g, ' ')
        .replace(/\\t/g, ' ')
        .replace(/\n/g, ' ')
        .replace(/\r/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function cleanHTML(html) {
    if (!html) return "";
    return html
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .trim();
}

const finalItems = [];
const seenIds = new Set();

console.log(`Processing ${sitemapData.length} items from crawl...`);

// Sort by date desc
sitemapData.sort((a, b) => {
    if (a.date !== b.date) {
        return b.date.localeCompare(a.date);
    }
    return b.id.localeCompare(a.id);
});

// Generic thumbnails from official site categories if the list is missing or generic
const GENERIC_THUMBNAILS = {
    HONOR: "/upload/generic_award.png", // Newly generated Gold/Red award icon
    SIHOU: "/upload/173016165.png", // Default news icon (Trend lists etc)
};

sitemapData.forEach(item => {
    if (seenIds.has(item.id)) return;

    // Merge with main list info if available (Golden metadata from list visit)
    // We PRIORITIZE main_list.json for the cover image to match the list view 100%
    if (mainListMap[item.id]) {
        if (mainListMap[item.id].image) {
            console.log(`  - Item ${item.id} using main_list.json image (Priority).`);
            item.image = mainListMap[item.id].image;
        }
        if (!item.summary || item.summary.length < 10) {
            if (mainListMap[item.id].summary && mainListMap[item.id].summary.length > 5) {
                item.summary = mainListMap[item.id].summary;
            }
        }
    }

    // SPECIAL LOGIC: Fix Award/Honor thumbnails ONLY if they are missing
    const isSihou = /嘶吼|势能榜/.test(item.title);
    const isAward = /专利奖|荣获|获评|入选|颁发|杰出伙伴|优秀奖|榜单/.test(item.title);

    if (isSihou) {
        if (!item.image) {
            console.log(`  - Item ${item.id} detected as Sihou (Missing image). Mapping to default Sihou thumbnail.`);
            item.image = GENERIC_THUMBNAILS.SIHOU;
        }
    } else if (isAward) {
        if (!item.image) {
            console.log(`  - Item ${item.id} detected as Award (Missing image). Mapping to default Honor thumbnail.`);
            item.image = GENERIC_THUMBNAILS.HONOR;
        }
    }

    // Localize the thumbnail
    item.image = downloadImage(item.image);

    // Decode HTML entities in title (e.g., &#183; -> ·)
    item.title = item.title.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');

    let rawContent = "";
    if (item.chunks && item.chunks.length > 0) {
        rawContent = item.chunks[0].content;
    } else if (item.content) {
        rawContent = item.content;
    }

    // Localize images WITHIN content
    if (rawContent) {
        // Match all img src in content
        const imgReplacer = (match, p1) => {
            const localImg = downloadImage(p1);
            return match.replace(p1, localImg);
        };
        rawContent = rawContent.replace(/<img[^>]+src=["']([^"']+)["']/gi, imgReplacer);
    }

    // Robust Category Logic
    let category = "公司动态";
    const text = (item.title + " " + item.summary + " " + (rawContent ? rawContent.substring(0, 500) : "")).toLowerCase();

    // Check if it's already tagged in the sitemap or meta
    if (item.category) {
        category = item.category;
    } else {
        if (text.includes('政策') || text.includes('解读') || text.includes('法律') || text.includes('法规') || text.includes('条例') || text.includes('标准')) {
            category = "政策解读";
        } else if (text.includes('行业') || text.includes('产业') || text.includes('高峰论坛') || text.includes('博览会') || text.includes('研讨会')) {
            category = "行业动态";
        } else if (text.includes('获奖') || text.includes('荣誉') || text.includes('入选') || text.includes('奖项')) {
            category = "公司动态";
        }
    }

    // Final scrub for corrupted summaries and fallback
    if (item.summary.includes("运营商安全") && item.summary.length < 50 && !item.title.includes("运营商")) {
        item.summary = "";
    }

    if (!item.summary && rawContent) {
        // Strip HTML tags and take first 200 chars
        item.summary = rawContent.replace(/<[^>]+>/g, '').trim().substring(0, 200).replace(/\s+/g, ' ');
    }

    finalItems.push({
        id: item.id,
        title: cleanString(item.title),
        date: item.date,
        category: category,
        summary: cleanString(item.summary),
        image: item.image,
        content: cleanHTML(rawContent)
    });

    seenIds.add(item.id);
});

let fileContent = `export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  content: string;
}

export const newsData: NewsItem[] = [
`;

finalItems.forEach(item => {
    const entry = `  {
    "id": ${JSON.stringify(item.id)},
    "title": ${JSON.stringify(item.title)},
    "date": ${JSON.stringify(item.date)},
    "category": ${JSON.stringify(item.category)},
    "summary": ${JSON.stringify(item.summary).substring(0, 1000)},
    "image": ${JSON.stringify(item.image)}, 
    content: ${JSON.stringify(item.content)}
  },`;
    fileContent += entry + "\n";
});

fileContent += `];\n\nexport const industryNewsData: NewsItem[] = [];\n`;

fs.writeFileSync(newsTsPath, fileContent, 'utf8');
console.log(`Successfully generated news.ts with ${finalItems.length} items (fully localized and verified).`);
