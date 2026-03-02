const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    const allAdvs = {};

    for (let i = 1; i <= 20; i++) {
        const id = i < 10 ? `0${i}` : `${i}`;
        const url = `https://cs.new.myibc.net/Product_${id}`;
        console.log("Checking:", url);
        try {
            await page.goto(url, { waitUntil: 'load', timeout: 20000 });

            const data = await page.evaluate(() => {
                const results = [];
                // Look for "产品优势" or "为什么选择" headings first
                const headings = Array.from(document.querySelectorAll('.title, .tit, h2, h3'));
                let advContainer = null;
                for (let h of headings) {
                    if (h.innerText.includes('产品优势') || h.innerText.includes('选') || h.innerText.includes('优势')) {
                        advContainer = h.closest('.module') || h.closest('section') || h.parentElement.parentElement;
                        break;
                    }
                }

                if (advContainer) {
                    // Try to find items within
                    const items = advContainer.querySelectorAll('.item, li, .pro-adv-item, .box');
                    items.forEach(item => {
                        const titleEl = item.querySelector('.tit, h3, h4, .adv-tit');
                        if (titleEl) {
                            const title = titleEl.innerText.trim();
                            const descEl = item.querySelector('.desc, p, .adv-desc');
                            const desc = descEl ? descEl.innerText.trim() : item.innerText.replace(title, '').trim();
                            if (title && desc && title.length < 50) {
                                results.push({ title, desc });
                            }
                        }
                    });
                }

                // Fallback: If no structured items found, but we know what the text looks like
                if (results.length === 0) {
                    // try more generic matching
                    const allItems = document.querySelectorAll('.item');
                    allItems.forEach(item => {
                        const titleEl = item.querySelector('.tit, h3, h4');
                        if (titleEl) {
                            const title = titleEl.innerText.trim();
                            const descEl = item.querySelector('.desc, p');
                            const desc = descEl ? descEl.innerText.trim() : '';
                            if (title && desc && desc.length > 5 && title.length < 30) {
                                // verify it's not product features
                                if (!item.closest('.func')) {
                                    results.push({ title, desc });
                                }
                            }
                        }
                    });
                }

                return results;
            });

            if (data && data.length > 0) {
                // Remove duplicates
                const unique = [];
                const titles = new Set();
                for (let d of data) {
                    if (!titles.has(d.title)) {
                        titles.add(d.title);
                        unique.push(d);
                    }
                }
                allAdvs[`Product_SYNC_${i}`] = unique;
                console.log(`Found ${unique.length} for ${i}`);
            }
        } catch (e) { /* ignore */ }
    }

    fs.writeFileSync('extracted_advs.json', JSON.stringify(allAdvs, null, 2));
    await browser.close();
})();
