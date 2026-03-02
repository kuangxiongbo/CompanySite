const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    try {
        await page.goto('https://cs.new.myibc.net/Product_03', { waitUntil: 'networkidle2', timeout: 30000 });
        const html = await page.content();
        fs.writeFileSync('product_03_dump.html', html);
    } catch (e) { }
    await browser.close();
})();
