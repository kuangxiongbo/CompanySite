const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dataDir = path.join(__dirname, 'data');
const uploadDir = path.join(__dirname, 'public', 'upload', 'local_images');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const regex = /https?:\/\/[a-zA-Z0-9.\-_\/]+\.(png|jpg|jpeg)(?:\?[a-zA-Z0-9=&]*)?/gi;
    let match;
    const replacements = [];

    while ((match = regex.exec(content)) !== null) {
        // match[0] is the full URL
        let url = match[0];
        let filename = Buffer.from(url).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 15) + "." + match[1];
        let localPath = path.join(uploadDir, filename);
        let webPath = `/upload/local_images/${filename}`;

        if (!fs.existsSync(localPath)) {
            console.log(`Downloading ${url} -> ${filename}`);
            try {
                execSync(`curl -s -k -L -A "Mozilla/5.0" "${url}" -o "${localPath}"`);
            } catch (e) {
                console.error(`Failed to download ${url}`);
            }
        }

        replacements.push({ original: url, replacement: webPath });
    }

    // special case for data/research.ts where we have unsplash URLs without explicit .jpg at the end in some cases, wait the regex caught them but what if they do not end in .jpg?
    const regexUnsplash = /(https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+\?[a-zA-Z0-9=&]+)/g;
    while ((match = regexUnsplash.exec(content)) !== null) {
        let url = match[0];
        let filename = Buffer.from(url).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 15) + ".jpg";
        let localPath = path.join(uploadDir, filename);
        let webPath = `/upload/local_images/${filename}`;

        if (!fs.existsSync(localPath)) {
            console.log(`Downloading ${url} -> ${filename}`);
            try {
                execSync(`curl -s -k -L -A "Mozilla/5.0" "${url}" -o "${localPath}"`);
            } catch (e) {
                console.error(`Failed to download ${url}`);
            }
        }

        replacements.push({ original: url, replacement: webPath });
    }

    if (replacements.length > 0) {
        let newContent = content;
        for (let r of replacements) {
            newContent = newContent.split(r.original).join(r.replacement);
        }
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated ${filePath}`);
    }
}

const files = ['research.ts', 'products.ts', 'solutions.ts', 'news.ts', 'batch1_fix.json', 'batch1_remainder.json'];
for (const f of files) {
    const fullPath = path.join(dataDir, f);
    if (fs.existsSync(fullPath)) {
        processFile(fullPath);
    }
}

console.log("Done localizing images.");
