const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    const results = [];

    for (let i = 31; i <= 38; i++) {
        const url = `https://cs.new.myibc.net/Product_${i}`;
        console.log(`Scraping ${url}`);
        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            
            // Wait for main content to load
            await page.waitForTimeout(2000); // 2s buffer

            const data = await page.evaluate(() => {
                const name = document.querySelector('h1')?.innerText || document.querySelector('.hero-title')?.innerText || document.querySelector('.banner-title')?.innerText || document.querySelector('.title')?.innerText || '';
                const summary = document.querySelector('.hero-subtitle')?.innerText || document.querySelector('.desc')?.innerText || document.querySelector('.banner-desc')?.innerText || '';
                
                // Get features
                const features = [];
                document.querySelectorAll('.feature-item, .function-item, .core-item, .item').forEach(el => {
                    const title = el.querySelector('h3, h4, .title, .name')?.innerText;
                    const desc = el.querySelector('p, .desc, .text')?.innerText;
                    if (title && desc) features.push({ title, desc });
                });

                // Get advantages
                const advantages = [];
                document.querySelectorAll('.advantage-item, .adv-item, .value-item').forEach(el => {
                    const title = el.querySelector('h3, h4, .title, .name')?.innerText;
                    const desc = el.querySelector('p, .desc, .text')?.innerText;
                    if (title && desc) advantages.push({ title, desc });
                });

                // Get image
                const img = document.querySelector('.hero-img img, .banner img')?.src || '';

                return { name, summary, features, advantages, img };
            });
            results.push({ id: `Product_${i}`, ...data });
        } catch (err) {
            console.error(`Failed on Product_${i}: ${err.message}`);
        }
    }

    fs.writeFileSync('products_31_38.json', JSON.stringify(results, null, 2));
    await browser.close();
    console.log('Done!');
})();
