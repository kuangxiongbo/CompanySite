const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.goto("https://cs.new.myibc.net/Product_01", { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    const text = await page.evaluate(() => {
        const hs = Array.from(document.querySelectorAll('.title, .tit, h1, h2, h3, h4'));
        return hs.map(h => h.innerText.trim()).filter(h => h.length > 0);
    });
    console.log(text.join(', '));

    await browser.close();
})();
