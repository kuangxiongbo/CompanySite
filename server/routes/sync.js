const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { Page, PageCategory, NavigationItem, News } = require('../models');
const { auth, admin } = require('../middleware/auth');

// Helper: convert JSON value to TS-safe string
const toJson = (v) => JSON.stringify(v, null, 4);

// ─── Generate products.ts content from DB ───
const generateProductsTs = (categories, productsByCategory) => {
    const catLines = categories.map(cat => {
        const name = cat.title?.zh || cat.slug;
        const enName = cat.title?.en || cat.slug;
        return `    { id: '${cat.slug}', name: '${name}', enName: '${enName}' }`;
    });

    const productLines = [];
    for (const [catSlug, products] of Object.entries(productsByCategory)) {
        for (const p of products) {
            const titleZh = p.title?.zh || '';
            const desc = p.description?.zh || '';

            const features = [
                { title: '产品介绍', desc: desc },
                ...(p.content?.features || []).map(f => ({
                    title: typeof f.title === 'object' ? (f.title.zh || '') : f.title,
                    desc: typeof f.desc === 'object' ? (f.desc.zh || '') : f.desc,
                }))
            ];

            const advantages = (p.content?.advantages || []).map(a => ({
                title: typeof a.title === 'object' ? (a.title.zh || '') : a.title,
                desc: typeof a.desc === 'object' ? (a.desc.zh || '') : a.desc,
            }));

            const usecases = (p.content?.useCases || []).map(u => ({
                title: u.title || '',
                desc: u.desc || '',
            }));

            productLines.push(`    {
        "id": "${p.slug}",
        "name": ${JSON.stringify(titleZh)},
        "category": "${catSlug}",
        "tag": ${JSON.stringify(p.tag || '')},
        "image": ${JSON.stringify(p.heroImage || '')},
        "description": ${JSON.stringify(desc)},
        "features": ${JSON.stringify(features, null, 12).replace(/\n/g, '\n        ')},
        "advantages": ${JSON.stringify(advantages, null, 12).replace(/\n/g, '\n        ')},
        "useCases": "",
        "usecases_data": ${JSON.stringify(usecases, null, 12).replace(/\n/g, '\n        ')},
        "specs": []
    }`);
        }
    }

    return `// auto-generated — do not edit manually. Use admin backend to update.
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
    advantages?: ProductFeature[];
    useCases?: string;
    usecases_data?: ProductFeature[];
    specs: { label: string; value: string }[];
}

export const productCategories = [
    { id: 'all', name: '全部产品', enName: 'All Products' },
${catLines.join(',\n')}
];

export const productsData: ProductItem[] = [
${productLines.join(',\n')}
];
`;
};

// ─── Generate solutions.ts content from DB ───
const generateSolutionsTs = (solutionCats) => {
    const catBlocks = solutionCats.map(cat => {
        const catTitle = cat.title?.zh || cat.slug;
        const solutions = (cat.pages || []).map(p => {
            const titleZh = p.title?.zh || '';
            const subtitle = p.subtitle?.zh || '';
            const desc = p.description?.zh || '';
            const features = (p.content?.features || [])
                .map(f => {
                    if (!f) return '';
                    if (typeof f.title === 'object' && f.title) return f.title.zh || '';
                    return f.title || '';
                })
                .filter(Boolean); // Remove empty strings
            const advantages = (p.content?.advantages || [])
                .map(a => {
                    if (!a) return null;
                    return {
                        title: typeof a.title === 'object' && a.title ? (a.title.zh || '') : (a.title || ''),
                        desc: typeof a.desc === 'object' && a.desc ? (a.desc.zh || '') : (a.desc || ''),
                    };
                })
                .filter(Boolean); // Remove nulls

            return `            {
                "id": "${p.slug}",
                "number": "${p.sortOrder || 1}",
                "title": ${JSON.stringify(titleZh)},
                "category": "${catTitle}",
                "summary": ${JSON.stringify(subtitle || desc)},
                "bannerSubtitle": ${JSON.stringify(subtitle)},
                "needs": ${JSON.stringify(p.content?.needs || '')},
                "solutionDesc": ${JSON.stringify(p.content?.solutionDesc || '')},
                "features": ${JSON.stringify(features)},
                "advantages": ${JSON.stringify(advantages, null, 16).replace(/\n/g, '\n                ')},
                "usecases_data": [],
                "detailImage": ${JSON.stringify(p.heroImage || '')},
                "relatedIds": [],
                "highlights": []
            }`;
        });

        return `    {
        "id": "${cat.slug}",
        "title": "${catTitle}",
        "solutions": [
${solutions.join(',\n')}
        ]
    }`;
    });

    return `// auto-generated — do not edit manually. Use admin backend to update.
export interface SolutionItem {
    id: string;
    number: string;
    title: string;
    category: string;
    summary: string;
    bannerSubtitle?: string;
    needs?: string;
    solutionDesc?: string;
    features: string[];
    advantages?: { title: string; desc: string }[];
    usecases_data?: { title: string; desc: string }[];
    detailImage?: string;
    relatedIds?: string[];
    highlights?: string[];
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
${catBlocks.join(',\n')}
];
`;
};
// ─── Generate news.ts content from DB ───
const generateNewsTs = (newsItems) => {
    const items = newsItems.map(item => ({
        id: item.slug || `news-${item.id}`,
        title: item.title?.zh || '',
        date: item.publishedAt ? new Date(item.publishedAt).toISOString().split('T')[0] : '',
        category: item.category || '公司动态',
        summary: item.summary?.zh || '',
        image: item.coverImage || '',
        content: item.content?.zh || ''
    }));

    return `// auto-generated — do not edit manually. Use admin backend to update.
export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  content: string;
}

export const newsData: NewsItem[] = ${toJson(items)};
export const industryNewsData: NewsItem[] = [];
`;
};
// ─── POST /api/sync/export ───
router.post('/export', auth, admin, async (req, res) => {
    try {
        const results = { products: false, solutions: false, errors: [] };
        const dataDir = path.join(__dirname, '../../data');

        // ── 1. Products ──
        const productCats = await PageCategory.findAll({
            where: { type: 'product' },
            include: [{
                model: Page,
                as: 'pages',
                where: { isActive: true },
                required: false,
                order: [['sortOrder', 'ASC']],
            }],
            order: [['sortOrder', 'ASC']],
        });

        if (productCats.length > 0) {
            const productsByCategory = {};
            for (const cat of productCats) {
                if (cat.pages && cat.pages.length > 0) {
                    productsByCategory[cat.slug] = cat.pages;
                }
            }
            const tsContent = generateProductsTs(productCats, productsByCategory);
            fs.writeFileSync(path.join(dataDir, 'products.ts'), tsContent, 'utf8');
            results.products = true;
        }

        // ── 2. Solutions ──
        const solutionCats = await PageCategory.findAll({
            where: { type: 'solution' },
            include: [{
                model: Page,
                as: 'pages',
                where: { isActive: true },
                required: false,
                order: [['sortOrder', 'ASC']],
            }],
            order: [['sortOrder', 'ASC']],
        });

        if (solutionCats.length > 0) {
            const tsContent = generateSolutionsTs(solutionCats);
            fs.writeFileSync(path.join(dataDir, 'solutions.ts'), tsContent, 'utf8');
            results.solutions = true;
        }

        res.json({
            success: true,
            message: `同步完成！产品文件：${results.products ? '✓' : '跳过'}，方案文件：${results.solutions ? '✓' : '跳过'}`,
            results,
        });
    } catch (err) {
        console.error('Sync export error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});
// ─── POST /api/sync/export-news ───
router.post('/export-news', auth, admin, async (req, res) => {
    try {
        const dataDir = path.join(__dirname, '../../data');
        const news = await News.findAll({
            where: { isPublished: true },
            order: [['publishedAt', 'DESC']]
        });

        const tsContent = generateNewsTs(news);
        fs.writeFileSync(path.join(dataDir, 'news.ts'), tsContent, 'utf8');

        // Also write a JSON for easier loading if needed (optional, keeping current structure)
        fs.writeFileSync(path.join(dataDir, 'news.json'), toJson(news.map(item => ({
            id: item.slug || `news-${item.id}`,
            title: item.title?.zh || '',
            date: item.publishedAt ? new Date(item.publishedAt).toISOString().split('T')[0] : '',
            category: item.category || '公司动态',
            summary: item.summary?.zh || '',
            image: item.coverImage || '',
            content: item.content?.zh || ''
        }))), 'utf8');

        res.json({
            success: true,
            message: `新闻同步完成！共同步 ${news.length} 条记录。`,
        });
    } catch (err) {
        console.error('News sync error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});
// ─── GET /api/sync/status ─── (check last sync time)
router.get('/status', auth, admin, async (req, res) => {
    try {
        const dataDir = path.join(__dirname, '../../data');
        const files = ['products.ts', 'solutions.ts'];
        const status = {};
        for (const f of files) {
            const fp = path.join(dataDir, f);
            if (fs.existsSync(fp)) {
                const stat = fs.statSync(fp);
                status[f] = { exists: true, lastModified: stat.mtime };
            } else {
                status[f] = { exists: false };
            }
        }
        res.json(status);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
