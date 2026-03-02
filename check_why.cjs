const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    for (let id of ['01', '31']) {
        const url = `https://cs.new.myibc.net/Product_${id}`;
        console.log("Fetching: " + url);
        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            await new Promise(r => setTimeout(r, 3000));
            const advs = await page.evaluate(() => {
                const results = [];
                // Look for "为什么选我" or "产品优势" text nodes
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
                let n;
                while (n = walker.nextNode()) {
                    const t = n.nodeValue.trim();
                    if (t.includes('为什么选') || t.includes('优势')) {
                        results.push('HEADING FOUND: ' + t);
                        // find parent and print its text
                        let p = n.parentElement;
                        while (p && p.innerText.length < 500) {
                            p = p.parentElement;
                        }
                        if (p) results.push('PARENT: ' + p.innerText.substring(0, 200));
                    }
                }
                return results;
            });
            console.log(advs.join('\n\n'));
        } catch (e) { }
    }

    await browser.close();
})();
