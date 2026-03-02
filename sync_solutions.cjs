const fs = require('fs');
const path = require('path');

const extractedPath = path.join(__dirname, 'extracted_solutions.json');
const targetPath = path.join(__dirname, 'data/solutions.ts');

if (!fs.existsSync(extractedPath)) {
    console.error('extracted_solutions.json not found');
    process.exit(1);
}

const itemsRaw = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));

const CATEGORY_MAP = [
    { id: 'gov', title: '政务安全', count: 7 },
    { id: 'operator', title: '运营商安全', count: 6 },
    { id: 'enterprise', title: '企业安全', count: 7 },
    { id: 'resources', title: '自然资源安全', count: 3 },
    { id: 'other', title: '其他行业安全', count: 4 }
];

function getCategoryInfo(index) {
    let current = 0;
    for (const cat of CATEGORY_MAP) {
        if (index < current + cat.count) {
            return cat;
        }
        current += cat.count;
    }
    return CATEGORY_MAP[CATEGORY_MAP.length - 1];
}

function parseContent(content) {
    if (!content) return { needs: '', solutionDesc: '', features: [], advantages: [], usecases: [] };
    const parts = content.split(' | ').map(p => p.trim());
    const result = {
        needs: '',
        solutionDesc: '',
        features: [],
        advantages: [],
        usecases: []
    };

    let currentSection = '';

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (part === '安全需求' || part === '业务挑战') {
            currentSection = 'needs';
            continue;
        } else if (part === '产品方案' || part === '解决方案') {
            currentSection = 'desc';
            continue;
        } else if (part === '核心特色' || part === '方案优势' || part === '产品优势') {
            currentSection = 'advantages';
            continue;
        } else if (part === '主要功能' || part === '特色优势') {
            currentSection = 'features';
            continue;
        } else if (part === '应用场景') {
            currentSection = 'usecases';
            continue;
        } else if (['安全产品', '解决方案', '技术研究', '关于奥联', '联系我们'].includes(part)) {
            currentSection = 'end';
            break;
        }

        if (currentSection === 'needs') {
            result.needs += (result.needs ? ' ' : '') + part;
        } else if (currentSection === 'desc') {
            result.solutionDesc += (result.solutionDesc ? ' ' : '') + part;
        } else if (currentSection === 'advantages' || currentSection === 'features' || currentSection === 'usecases') {
            if (i + 1 < parts.length) {
                const title = part;
                const desc = parts[i + 1];

                if (!['安全需求', '业务挑战', '解决方案', '主要功能', '应用场景', '安全产品', '特色优势'].includes(desc)) {
                    const sectionName = currentSection === 'features' ? 'features' : currentSection;
                    if (sectionName === 'features') {
                        result.features.push(`${title}: ${desc}`);
                    } else {
                        result[sectionName].push({ title, desc });
                    }
                    i++;
                }
            }
        }
    }

    return result;
}

const processedCategories = CATEGORY_MAP.map(cat => ({
    id: cat.id,
    title: cat.title,
    solutions: []
}));

itemsRaw.forEach((item, idx) => {
    const catInfo = getCategoryInfo(idx);
    const parsed = parseContent(item.content);
    const catObj = processedCategories.find(c => c.id === catInfo.id);

    catObj.solutions.push({
        id: item.id,
        number: (idx + 1).toString(),
        title: item.title,
        category: catInfo.title,
        summary: item.subtitle,
        bannerSubtitle: item.subtitle,
        needs: parsed.needs,
        solutionDesc: parsed.solutionDesc,
        features: parsed.features.length > 0 ? parsed.features : ['合规性满足', '安全性保障', '灵活扩展'],
        advantages: parsed.advantages,
        usecases_data: parsed.usecases,
        detailImage: item.raw_image ? (item.raw_image.startsWith('//') ? 'https:' + item.raw_image : item.raw_image) : '/upload/local_images/solution_hero_generic.png'
    });
});

let tsContent = fs.readFileSync(targetPath, 'utf8');

const startMarker = 'export const solutionCategories: SolutionCategory[] = [';
const endMarker = '];';

const startIdx = tsContent.indexOf(startMarker);
const endIdx = tsContent.lastIndexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
    const newTsContent = tsContent.substring(0, startIdx + startMarker.length) +
        '\n' + processedCategories.map(c => '    ' + JSON.stringify(c, null, 4).replace(/\n/g, '\n    ')).join(',\n') +
        '\n' + tsContent.substring(endIdx);

    fs.writeFileSync(targetPath, newTsContent);
    console.log(`Successfully updated data/solutions.ts with ${itemsRaw.length} solutions`);
} else {
    console.error('Markers not found in data/solutions.ts');
}
