const { chromium } = require('playwright');
(async () => {
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage({ viewport: { width: 1440, height: 2000 } });
        await page.goto('https://cs.new.myibc.net/Product_09', { waitUntil: 'load' });
        // Wait for potential rendering
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'product09_full.png', fullPage: true });
        console.log('Saved product09_full.png');
        await browser.close();
    } catch (err) {
        console.error(err);
    }
})();
