const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  try {
    await page.goto('https://cs.new.myibc.net/Product_01', { waitUntil: 'networkidle2', timeout: 30000 });
    const text = await page.evaluate(() => {
      const getGroup = (selector) => {
        const els = document.querySelectorAll(selector);
        return Array.from(els).map(el => el.innerText.trim());
      };
      return {
        title: document.querySelector('.Banner_Tit')?.innerText || '',
        subtitle: document.querySelector('.Banner_tit_span')?.innerText || '',
        features: getGroup('.Mod1_div_Text_Title'),
        featureDescs: getGroup('.Mod1_div_Text_p'),
        advTitles: getGroup('.Mod2_div_right_Title'),
        advDescs: getGroup('.Mod2_div_right_p'),
        usecases: document.querySelector('.Mod3_div_p')?.innerText || ''
      };
    });
    console.log("EXTRACTED:", JSON.stringify(text, null, 2));
  } catch (e) {
    console.error("Error", e);
  } finally {
    await browser.close();
  }
})();
