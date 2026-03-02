const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const uploadDir = path.join(__dirname, 'public', 'upload', 'local_images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

function processFilesDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const fullPath = path.join(dir, f);
        if (fs.statSync(fullPath).isDirectory()) {
            processFilesDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;

            const regex = /(https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+\?[-a-zA-Z0-9=&]+)/g;
            let match;
            const replacements = [];

            while ((match = regex.exec(content)) !== null) {
                let url = match[0];
                let filename = Buffer.from(url.split('?')[0]).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 15) + ".jpg";
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
                for (let r of replacements) {
                    content = content.split(r.original).join(r.replacement);
                }
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

// Replace in both components and pages (wait, do we have any in components too?)
processFilesDir(path.join(__dirname, 'pages'));
processFilesDir(path.join(__dirname, 'components'));
console.log("Done localizing component/pages images.");
