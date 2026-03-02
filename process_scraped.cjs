const fs = require('fs');
let code = fs.readFileSync('/Users/kuangxb/Desktop/CompanySite/data/products.ts', 'utf8');

const productsRaw = JSON.parse(fs.readFileSync('all_products_scraped.json', 'utf8'));

const mappedCats = {
    1: 'infrastructure', 2: 'infrastructure', 3: 'infrastructure', 4: 'infrastructure', 5: 'infrastructure',
    6: 'management', 7: 'management', 8: 'management', 9: 'management', 10: 'management', 11: 'management', 12: 'management', 13: 'management',
    14: 'auth', 15: 'auth', 16: 'auth', 17: 'auth', 18: 'auth', 19: 'auth', 20: 'auth',
    21: 'data-security', 22: 'data-security', 23: 'data-security', 24: 'data-security', 25: 'data-security', 26: 'data-security', 27: 'data-security', 28: 'data-security', 29: 'data-security', 30: 'data-security',
    31: 'iot', 32: 'iot', 33: 'iot', 34: 'iot',
    35: 'quantum', 36: 'quantum', 37: 'quantum', 38: 'quantum'
};

const newProducts = [];
for (let i = 1; i <= 38; i++) {
    const key = `Product_SYNC_${i}`;
    const mappedCatKey = mappedCats[i] || 'quantum';

    if (productsRaw[key]) {
        const p = productsRaw[key];

        let initialFeatures = [];
        if (p.intro) {
            initialFeatures.push(`{ title: "产品介绍", desc: "${p.intro.replace(/"/g, '\\"').replace(/\n/g, '\\n')}" }`);
        }

        const featureStrs = (p.features || []).map(f => `{ title: "${f.title.replace(/"/g, '\\"')}", desc: "${f.desc.replace(/"/g, '\\"').replace(/\n/g, '\\n')}" }`);
        initialFeatures = initialFeatures.concat(featureStrs);

        const advStrs = (p.advantages || []).map(a => `{ title: "${a.title.replace(/"/g, '\\"')}", desc: "${a.desc.replace(/"/g, '\\"').replace(/\n/g, '\\n')}" }`);
        const useStrs = (p.usecases || []).map(u => `{ title: "${u.title.replace(/"/g, '\\"')}", desc: "${u.desc.replace(/"/g, '\\"').replace(/\n/g, '\\n')}" }`);

        // Randomly assign a unique image (later we can download the real ones)
        const imgSrc = p.heroImageUrl ? p.heroImageUrl : `/upload/local_images/hero_prod_${i}.png`;

        newProducts.push(`   {
      id: '${key}',
      name: '${(p.name || '').replace(/'/g, "\\'")}',
      category: '${mappedCatKey}',
      tag: '核心产品',
      image: '${imgSrc}',
      description: '${(p.description || '').replace(/'/g, "\\'")}',
      features: [\n         ${initialFeatures.join(',\n         ')}\n      ],
      advantages: [\n         ${advStrs.join(',\n         ')}\n      ],
      usecases_data: [\n         ${useStrs.join(',\n         ')}\n      ],
      specs: []
   }`);
    }
}

const replacement = `export const productsData: ProductItem[] = [\n${newProducts.join(',\n')}\n];`;

const startIdx = code.indexOf('export const productsData');
let endIdx = code.indexOf('];', startIdx);
if (endIdx !== -1) { endIdx += 2; } else { endIdx = code.length; }

if (startIdx !== -1) {
    code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
    if (!code.includes('usecases_data?')) {
        code = code.replace('useCases?: string;', 'useCases?: string;\n    usecases_data?: ProductFeature[];');
    }
}

fs.writeFileSync('/Users/kuangxb/Desktop/CompanySite/data/products.ts', code);
console.log('Done injecting products');
