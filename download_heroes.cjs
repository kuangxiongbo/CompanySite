const fs = require('fs');
const https = require('https');
const http = require('http');

const delay = ms => new Promise(r => setTimeout(r, ms));

const productsRaw = JSON.parse(fs.readFileSync('all_products_scraped.json', 'utf8'));
const solutionsRaw = JSON.parse(fs.readFileSync('all_solutions_scraped.json', 'utf8'));

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        if (!url || !url.startsWith('http')) return resolve();

        let client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            if (res.statusCode === 200) {
                const file = fs.createWriteStream(filepath);
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            } else {
                resolve();
            }
        }).on('error', (err) => {
            console.error('Download error:', err.message);
            resolve();
        });
    });
};

(async () => {
    for (let i = 1; i <= 38; i++) {
        const key = `Product_SYNC_${i}`;
        const prod = productsRaw[key];
        if (prod && prod.heroImageUrl) {
            const ext = prod.heroImageUrl.split('.').pop() || 'png';
            const dest = `/Users/kuangxb/Desktop/CompanySite/public/upload/local_images/prod_hero_${i}.${ext}`;
            console.log(`Downloading ${prod.heroImageUrl} to ${dest}`);
            await downloadImage(prod.heroImageUrl, dest);
            await delay(200);
        }
    }
    for (let i = 1; i <= 20; i++) {
        const key = `Solution_SYNC_${i}`;
        const sol = solutionsRaw[key];
        if (sol && sol.heroImageUrl) {
            const ext = sol.heroImageUrl.split('.').pop() || 'png';
            const dest = `/Users/kuangxb/Desktop/CompanySite/public/upload/local_images/sol_hero_${i}.${ext}`;
            console.log(`Downloading ${sol.heroImageUrl} to ${dest}`);
            await downloadImage(sol.heroImageUrl, dest);
            await delay(200);
        }
    }
})();
