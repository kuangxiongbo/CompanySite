const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapePage(page, url) {
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));

        return await page.evaluate(() => {
            const data = {
                name: '',
                description: '',
                intro: '',
                features: [],
                advantages: [],
                usecases: [],
                heroImageUrl: ''
            };

            // Hero section
            data.name = document.querySelector('.hero-title, h1, .banner-title, .pro-tit')?.innerText.trim() || '';
            data.description = document.querySelector('.hero-subtitle, .banner-desc, .sub-tit')?.innerText.trim() || '';

            // Hero image
            const bannerImg = document.querySelector('.banner img, .hero img, .top-banner img');
            if (bannerImg) data.heroImageUrl = bannerImg.src;

            // Helper to get structured items from a section heading
            const getItemsFromSection = (headingRegex) => {
                const headings = Array.from(document.querySelectorAll('h2, h3, .title, .tit'));
                const targetHeading = headings.find(h => headingRegex.test(h.innerText));
                if (!targetHeading) return [];

                // Find nearest container
                let container = targetHeading.closest('.module, section') || targetHeading.parentElement.parentElement;
                if (!container) return [];

                const items = [];
                const itemEls = container.querySelectorAll('.item, li, .pro-adv-item, .box, .col');
                itemEls.forEach(el => {
                    const t = el.querySelector('.tit, h3, h4, .title, .item-title, .name')?.innerText || '';
                    const dEl = el.querySelector('.desc, p, .txt, .content');
                    const d = dEl ? dEl.innerText : el.innerText.replace(t, '').trim();
                    if (t && d && t !== d && t.length < 50 && d.length < 300) {
                        items.push({ title: t.trim(), desc: d.trim() });
                    }
                });
                return items;
            };

            // Intro text
            const introHeading = Array.from(document.querySelectorAll('h2, h3, .title, .tit')).find(h => /介绍|概述/.test(h.innerText));
            if (introHeading) {
                let p = introHeading.nextElementSibling;
                let introText = '';
                while (p && p.tagName === 'P') {
                    introText += p.innerText + '\n';
                    p = p.nextElementSibling;
                }
                if (!introText) {
                    const container = introHeading.closest('.module, section') || introHeading.parentElement;
                    const descEl = container.querySelector('.desc, p:not(.tit)');
                    if (descEl) introText = descEl.innerText;
                }
                data.intro = introText.trim();
            }

            data.features = getItemsFromSection(/功能|特点|能力/);
            data.advantages = getItemsFromSection(/优势|为什么/);
            data.usecases = getItemsFromSection(/场景/);

            return data;
        });
    } catch (e) {
        console.error('Error on ' + url, e.message);
        return null;
    }
}

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Scrape all products
    const products = {};
    for (let i = 1; i <= 38; i++) {
        const id = i < 10 ? `0${i}` : `${i}`;
        const url = `https://cs.new.myibc.net/Product_${id}`;
        console.log('Scraping product', url);
        const res = await scrapePage(page, url);
        if (res && res.name) {
            products[`Product_SYNC_${i}`] = res;
        }
    }
    fs.writeFileSync('all_products_scraped.json', JSON.stringify(products, null, 2));
    console.log('Saved products to all_products_scraped.json');

    // Scrape all solutions
    const solutions = {};
    for (let i = 1; i <= 20; i++) {
        const id = i < 10 ? `0${i}` : `${i}`;
        const url = `https://cs.new.myibc.net/Solution_${id}`;
        console.log('Scraping solution', url);
        const res = await scrapePage(page, url);
        if (res && res.name) {
            solutions[`Solution_SYNC_${i}`] = res;
        }
    }
    fs.writeFileSync('all_solutions_scraped.json', JSON.stringify(solutions, null, 2));
    console.log('Saved solutions to all_solutions_scraped.json');

    await browser.close();
})();
