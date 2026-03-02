const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    try {
        await page.goto('https://cs.new.myibc.net/Product_01', { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 4000));

        const texts = await page.evaluate(() => {
            const arr = [];
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while (node = walker.nextNode()) {
                const t = node.nodeValue.trim();
                if (t.length > 3) arr.push(t);
            }
            return arr;
        });

        console.log(texts.filter(t => t.includes('优势') || t.includes('选')).join('\n'));

        fs.writeFileSync('p1_texts.json', JSON.stringify([...new Set(texts)]));
    } catch (e) {
        console.error(e);
    }
    await browser.close();
})();
