const fs = require('fs');
const path = require('path');

const extractedPath = path.join(__dirname, 'extracted_products.json');
const targetPath = path.join(__dirname, 'data/products.ts');

if (!fs.existsSync(extractedPath)) {
    console.error('extracted_products.json not found');
    process.exit(1);
}

const productsRaw = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));

// Based on index (1-based)
const getCategory = (index) => {
    if (index <= 8) return 'infrastructure';
    if (index <= 13) return 'management';
    if (index <= 19) return 'auth';
    if (index <= 31) return 'data-security';
    if (index <= 34) return 'iot';
    if (index <= 38) return 'quantum';
    return 'infrastructure';
};

function parseContent(content) {
    if (!content) return { description: '', features: [], advantages: [], usecases: [] };
    const parts = content.split(' | ').map(p => p.trim());
    const result = {
        description: '',
        features: [],
        advantages: [],
        usecases: []
    };

    let currentSection = '';

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (part === '产品介绍') {
            currentSection = 'intro';
            continue;
        } else if (part === '产品价值' || part === '产品优势') {
            currentSection = 'advantages';
            continue;
        } else if (part === '主要功能') {
            currentSection = 'features';
            continue;
        } else if (part === '应用场景') {
            currentSection = 'usecases';
            continue;
        } else if (['安全产品', '解决方案', '技术研究', '关于奥联', '联系我们'].includes(part)) {
            currentSection = 'end';
            break;
        }

        if (currentSection === 'intro') {
            result.description += (result.description ? ' ' : '') + part;
        } else if (currentSection === 'advantages' || currentSection === 'features' || currentSection === 'usecases') {
            if (i + 1 < parts.length) {
                const title = part;
                const desc = parts[i + 1];

                if (!['产品介绍', '产品价值', '产品优势', '主要功能', '应用场景', '安全产品'].includes(desc)) {
                    result[currentSection].push({ title, desc });
                    i++;
                }
            }
        }
    }

    return result;
}

const productsData = productsRaw
    .filter(p => p.title) // Skip empty products
    .map((p, idx) => {
        const parsed = parseContent(p.content);
        let name = p.title;
        // Fix naming mismatches
        if (p.id === 'Product_07' && p.content.includes('软件密码模块')) {
            name = '软件密码模块';
        }
        if (p.id === 'Product_05') {
            name = '协同签名系统';
        }

        return {
            id: p.id,
            name: name,
            category: getCategory(idx + 1),
            tag: '核心产品',
            image: p.raw_image ? (p.raw_image.startsWith('//') ? 'https:' + p.raw_image : p.raw_image) : '/upload/local_images/generic_product_hero.png',
            description: p.subtitle || parsed.description.substring(0, 100),
            features: [
                { title: '产品介绍', desc: parsed.description || p.subtitle },
                ...parsed.features
            ],
            advantages: parsed.advantages,
            usecases_data: parsed.usecases,
            specs: []
        };
    });

let tsContent = fs.readFileSync(targetPath, 'utf8');

const startMarker = 'export const productsData: ProductItem[] = [';
const endMarker = '];';

const startIdx = tsContent.indexOf(startMarker);
const endIdx = tsContent.lastIndexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
    const newTsContent = tsContent.substring(0, startIdx + startMarker.length) +
        '\n' + productsData.map(p => '    ' + JSON.stringify(p, null, 4).replace(/\n/g, '\n    ')).join(',\n') +
        '\n' + tsContent.substring(endIdx);

    fs.writeFileSync(targetPath, newTsContent);
    console.log(`Successfully updated data/products.ts with ${productsData.length} products`);
} else {
    console.error('Markers not found in data/products.ts');
}
