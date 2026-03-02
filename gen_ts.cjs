const fs = require('fs');

const prods = JSON.parse(fs.readFileSync('extracted_products.json'));
let productsData = prods.map(p => {
    let parts = p.content.split(' | ');
    let cat = p.content.split(' | ')[0] || 'infrastructure';
    let features = [];
    // Guess features from parts
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] && parts[i].length < 15 && parts[i + 1] && parts[i + 1].length > 15) {
            features.push(`{ title: "${parts[i].replace(/"/g, '\\\\"')}", desc: "${parts[i + 1].replace(/"/g, '\\\\"')}" }`);
        }
    }
    if (features.length === 0) features.push('{ title: "标准功能", desc: "符合国密技术规范" }');
    if (features.length > 5) features = features.slice(0, 5);

    return `    {
        id: '${p.id}',
        name: '${p.title}',
        category: 'infrastructure',
        tag: '核心产品',
        image: '/upload/174971510.png',
        description: '${p.subtitle}',
        features: [
            ${features.join(',\n            ')}
        ],
        useCases: "广泛适用于各关键信息基础设施行业。",
        specs: [
            { label: "合规标准", value: "GM/T 标准" },
            { label: "性能指标", value: "高吞吐量处理" }
        ]
    }`;
});

let outProd = `import { BrainCircuit, Fingerprint, Lock, Network, Shield, Cpu, Scale } from 'lucide-react';

export interface ProductFeature {
    title: string;
    desc: string;
}

export interface ProductItem {
    id: string;
    name: string;
    category: string;
    tag?: string;
    image: string;
    description: string;
    features: ProductFeature[];
    useCases?: string;
    specs: { label: string; value: string }[];
}

export const productCategories = [
    { id: 'all', name: '全部产品', enName: 'All Products' },
    { id: 'infrastructure', name: '密码基础产品类', enName: 'Infrastructure' },
    { id: 'management', name: '密码管理平台类', enName: 'Management' },
];

export const productsData: ProductItem[] = [
${productsData.join(',\n')}
];
`;
fs.writeFileSync('data/products.ts', outProd);
console.log("Updated products.ts");

const sols = JSON.parse(fs.readFileSync('extracted_solutions.json'));
let solutionsDataItems = sols.map(s => {
    let parts = s.content.split(' | ');
    let features = [];
    for (let i = 0; i < parts.length; i++) {
        if (parts[i].length < 10) features.push(`'${parts[i].replace(/'/g, "\\'")}'`);
    }
    if (features.length === 0) features = ["'数据加密'", "'合规建设'"];
    if (features.length > 5) features = features.slice(0, 5);

    return `            {
                id: '${s.id}',
                number: '${s.id.replace('Solution_', '')}',
                title: '${s.title}',
                category: '政务安全',
                summary: '${s.subtitle}',
                bannerSubtitle: '${s.subtitle}',
                needs: '${s.subtitle}。面临严峻挑战，亟需解决问题。',
                solutionDesc: '${parts.join(" ").substring(0, 100)}...',
                features: [${features.join(', ')}],
            }`;
});

let outSol = `export interface SolutionItem {
    id: string;
    number: string;
    title: string;
    category: string;
    summary: string;
    bannerSubtitle: string;
    needs: string;
    solutionDesc: string;
    features: string[];
    detailImage?: string;
}

export interface SolutionCategory {
    id: string;
    title: string;
    solutions: SolutionItem[];
}

export const solutionIntro = {
    title: '解决方案',
    desc1: '奥联公司以自主研发、合规认证的密码产品为基石。',
    desc2: '为政务、运营商、金融、医疗、教育等领域提供成熟可靠的综合密码安全体系。',
    pyramidImage: '/upload/local_images/solution_pyramid.png',
};

export const solutionCategories: SolutionCategory[] = [
    {
        id: 'gov',
        title: '政务安全',
        solutions: [
${solutionsDataItems.join(',\n')}
        ],
    }
];
`;
fs.writeFileSync('data/solutions.ts', outSol);
console.log("Updated solutions.ts");
