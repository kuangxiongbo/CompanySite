const fs = require('fs');

const prodsExtracted = JSON.parse(fs.readFileSync('extracted_products.json'));
const solsExtracted = JSON.parse(fs.readFileSync('extracted_solutions.json'));

let outProd = `// auto-generated to sync with categories
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
    { id: 'auth', name: '认证与传输类', enName: 'Auth & Transport' },
    { id: 'data-security', name: '数据安全类', enName: 'Data Security' },
    { id: 'iot', name: '物联网安全类', enName: 'IoT Security' },
    { id: 'quantum', name: '后量子系列', enName: 'Post Quantum' }
];

export const productsData: ProductItem[] = [
`;

const categoriesList = [
    { id: 'infrastructure', items: ["服务器密码机", "云服务器密码机", "签名验签服务器", "智能密码钥匙", "协同签名系统/客户端", "TEE密码模块", "软件密码模块", "PCI-E密码卡"] },
    { id: 'management', items: ["统一密码服务平台", "密钥管理系统", "证书认证系统", "密码资源运维平台", "商用密码监管平台"] },
    { id: 'auth', items: ["安全接入网关", "综合安全网关", "数据安全传输SSL VPN产品", "透明加密网关", "安全接入终端", "4G无线数据终端"] },
    { id: 'data-security', items: ["数据库加解密系统", "数据安全服务平台", "数据脱敏与水印溯源平台", "隐私计算服务平台", "安全存储分发系统", "文件分发管控系统", "文件透明加解密系统", "国密堡垒机", "视频加密服务器", "加密即时通讯平台/客户端", "邮件加密网关", "安全邮件客户端"] },
    { id: 'iot', items: ["视频安全产品", "工业互联网安全标识解析系统", "物联网安全模组"] },
    { id: 'quantum', items: ["抗量子密码机", "抗量子证书认证系统", "抗量子密钥管理系统", "抗量子系列产品"] }
];

let globalProdIndex = 1;
categoriesList.forEach(cat => {
    cat.items.forEach(itemName => {
        // try to find matching extracted info by name similarity, or fallback
        let ext = prodsExtracted.find(p => p.title.includes(itemName) || itemName.includes(p.title));
        let pId = `Product_SYNC_${globalProdIndex++}`;

        let sub = ext ? ext.subtitle : "符合行业标准的国家级安全密码产品";

        let feats = "";
        if (ext) {
            let parts = ext.content.split(' | ');
            let features = [];
            for (let i = 0; i < parts.length; i++) {
                if (parts[i] && parts[i].length < 15 && parts[i + 1] && parts[i + 1].length > 15) {
                    features.push(`{ title: "${parts[i].replace(/"/g, '\\\\"')}", desc: "${parts[i + 1].replace(/"/g, '\\\\"')}" }`);
                }
            }
            if (features.length === 0) features.push('{ title: "标准功能", desc: "符合国密技术规范" }');
            feats = features.slice(0, 5).join(',\n            ');
        } else {
            feats = `{ title: "核心功能", desc: "采用自主可控商用密码技术体系研发。" },\n            { title: "安全合规", desc: "满足国密标准及等级保护规范要求。" }`;
        }

        outProd += `    {
        id: '${pId}',
        name: '${itemName}',
        category: '${cat.id}',
        tag: '核心产品',
        image: '/upload/local_images/aHR0cHM6.jpg',
        description: '${sub}',
        features: [
            ${feats}
        ],
        useCases: "广泛适用于各关键信息基础设施行业。",
        specs: [
            { label: "合规标准", value: "GM/T 标准" },
            { label: "性能指标", value: "高吞吐量及稳定输出" }
        ]
    },\n`;
    });
});
outProd += `];\n`;
fs.writeFileSync('data/products.ts', outProd);
console.log('Fixed data/products.ts');

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
`;

const solCatsList = [
    { id: 'gov', title: "政务安全", items: ["政务外网数据安全总线", "基于SM9的零信任网络访问", "政务云密码资源池", "政务信创密码改造"] },
    { id: 'operator', title: "运营商安全", items: ["基于SM9的5G安全认证", "运营商云安全管理", "大数据平台安全计算"] },
    { id: 'enterprise', title: "企业安全", items: ["石油天然气工控", "水利资源监控", "电力能源轻量级密码", "国企海外安全通信", "企业微信密码应用", "飞书密码应用", "工业互联网标识解析"] },
    { id: 'resources', title: "自然资源安全", items: ["时空大数据平台", "准站/观测站密码建设", "地理测绘数据分发"] },
    { id: 'other', title: "其他行业安全", items: ["医疗公共保障平台", "智能网联车密码技术", "金融数据安全", "智慧教育信息系统"] }
];

let globalSolIndex = 1;
solCatsList.forEach(cat => {
    outSol += `    {
        id: '${cat.id}',
        title: '${cat.title}',
        solutions: [\n`;

    cat.items.forEach(itemName => {
        let ext = solsExtracted.find(s => s.title.includes(itemName) || itemName.includes(s.title));
        let sId = `Solution_SYNC_${globalSolIndex++}`;

        let sub = ext ? ext.subtitle : "符合行业标准的国家级安全架构";
        let desc = ext ? ext.content.split(' | ').join(" ").substring(0, 100) + "..." : "我们将先进密码技术融入业务流，确保各项合规要求落地，并提供灵活扩展空间，护航数字化转型。";

        outSol += `            {
                id: '${sId}',
                number: '${globalSolIndex - 1}',
                title: '${itemName}',
                category: '${cat.title}',
                summary: '${sub}',
                bannerSubtitle: '${sub}',
                needs: '${sub}。面临严峻挑战，亟需解决问题。',
                solutionDesc: '${desc}',
                features: ['数据加密保护', '合规性满足', '平滑升级架构'],
            },\n`;
    });
    outSol += `        ],
    },\n`;
});
outSol += `];\n`;
fs.writeFileSync('data/solutions.ts', outSol);
console.log('Fixed data/solutions.ts');
