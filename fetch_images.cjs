const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const http = require('http');

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                res.resume();
                resolve(null);
            }
        }).on('error', reject);
    });
};

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    let code = fs.readFileSync('/Users/kuangxb/Desktop/CompanySite/data/products.ts', 'utf8');

    for (let i = 1; i <= 38; i++) {
        const url = `https://cs.new.myibc.net/Product_${i}`;
        console.log(`Extracting image for ${url}`);
        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            await new Promise(r => setTimeout(r, 2000));

            // Evaluates to find the largest product-like image
            const imgUrl = await page.evaluate(() => {
                const imgs = Array.from(document.querySelectorAll('img')).filter(img =>
                    !img.src.includes('ga_icon') &&
                    !img.src.includes('logo') &&
                    !img.src.includes('banner.png') &&
                    img.width > 200 && img.height > 100
                ).sort((a, b) => (b.width * b.height) - (a.width * a.height));
                return imgs.length > 0 ? imgs[0].src : null;
            });

            if (imgUrl) {
                const dUrl = imgUrl.startsWith('//') ? 'https:' + imgUrl : imgUrl;
                const path = `/Users/kuangxb/Desktop/CompanySite/public/upload/local_images/Product_SYNC_${i}.png`;
                await downloadImage(dUrl, path);
                console.log(`Saved ${dUrl} to Product_SYNC_${i}.png`);

                // We replace the image tag in data/products.ts dynamically
                const searchStr = `id: 'Product_SYNC_${i}',`;
                const endStr = `image:`;
                const startIdx = code.indexOf(searchStr);
                if (startIdx !== -1) {
                    const imgPropIdx = code.indexOf(endStr, startIdx);
                    if (imgPropIdx !== -1 && imgPropIdx - startIdx < 500) {
                        const nextComma = code.indexOf(',', imgPropIdx);
                        const originalLine = code.substring(imgPropIdx, nextComma + 1);
                        code = code.replace(originalLine, `image: '/upload/local_images/Product_SYNC_${i}.png',`);
                    }
                }
            } else {
                console.log(`No image found for Product_${i}`);
            }
        } catch (err) {
            console.error(`Failed on Product_${i}: ${err.message}`);
        }
    }
    fs.writeFileSync('/Users/kuangxb/Desktop/CompanySite/data/products.ts', code);
    await browser.close();
    console.log('Done!');
})();
