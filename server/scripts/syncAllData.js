const { Page, PageCategory, NavigationItem, sequelize } = require('../models');
const fs = require('fs');
const path = require('path');

async function sync() {
    console.log('Starting data migration...');

    try {
        await sequelize.sync({ force: true }); // Reset tables for a clean start
        console.log('Database synced (tables recreated).');

        // 1. Define Categories from translations.ts and products.ts
        const productCategories = [
            { slug: 'infrastructure', type: 'product', title: { zh: '密码基础产品类', en: 'Infrastructure' }, icon: 'Server', sortOrder: 1 },
            { slug: 'management', type: 'product', title: { zh: '密码管理平台类', en: 'Management' }, icon: 'Shield', sortOrder: 2 },
            { slug: 'auth', type: 'product', title: { zh: '认证与传输类', en: 'Auth & Transport' }, icon: 'Lock', sortOrder: 3 },
            { slug: 'data-security', type: 'product', title: { zh: '数据安全类', en: 'Data Security' }, icon: 'Database', sortOrder: 4 },
            { slug: 'iot', type: 'product', title: { zh: '物联网安全类', en: 'IoT Security' }, icon: 'Cpu', sortOrder: 5 },
            { slug: 'quantum', type: 'product', title: { zh: '后量子系列', en: 'Post Quantum' }, icon: 'Zap', sortOrder: 6 }
        ];

        const solutionCategories = [
            { slug: 'gov', type: 'solution', title: { zh: '政务安全', en: 'Government Security' }, icon: 'Landmark', sortOrder: 1 },
            { slug: 'operator', type: 'solution', title: { zh: '运营商安全', en: 'Operator Security' }, icon: 'Radio', sortOrder: 2 },
            { slug: 'enterprise', type: 'solution', title: { zh: '企业安全', en: 'Enterprise Security' }, icon: 'Building2', sortOrder: 3 },
            { slug: 'resources', type: 'solution', title: { zh: '自然资源安全', en: 'Natural Resources' }, icon: 'Mountain', sortOrder: 4 },
            { slug: 'other', type: 'solution', title: { zh: '其他行业安全', en: 'Other Industries' }, icon: 'Globe', sortOrder: 5 }
        ];

        const createdCategories = {};

        for (const cat of [...productCategories, ...solutionCategories]) {
            const created = await PageCategory.create({
                type: cat.type,
                slug: cat.slug,
                title: cat.title,
                config: { icon: cat.icon },
                sortOrder: cat.sortOrder
            });
            createdCategories[`${cat.type}_${cat.slug}`] = created.id;
        }

        console.log('Categories created.');

        // 2. Load Products Data (simplified extraction from file or embedded)
        // Since I've read the file, I'll embed the main ones or write a small parser helper
        // For brevity and reliability, I will parse the products.ts file content
        const productsFilePath = path.join(__dirname, '../../data/products.ts');
        const productsContent = fs.readFileSync(productsFilePath, 'utf8');

        // Extract productsData array
        const productsMatch = productsContent.match(/export const productsData: ProductItem\[\] = (\[[\s\S]*?\]);/);
        const rawProducts = JSON.parse(productsMatch[1]);

        for (const prod of rawProducts) {
            await Page.create({
                type: 'product',
                slug: prod.id.toLowerCase().replace(/_/g, '-'),
                title: { zh: prod.name, en: prod.name }, // En will be the same for now
                description: { zh: prod.description, en: '' },
                heroImage: prod.image,
                tag: prod.tag,
                categoryId: createdCategories[`product_${prod.category}`],
                content: {
                    features: prod.features.map(f => ({ title: { zh: f.title, en: '' }, desc: { zh: f.desc, en: '' } })),
                    advantages: (prod.advantages || []).map(f => ({ title: { zh: f.title, en: '' }, desc: { zh: f.desc, en: '' } })),
                    useCases: Array.isArray(prod.usecases_data) ? prod.usecases_data.map(f => ({ title: { zh: f.title, en: '' }, desc: { zh: f.desc, en: '' } })) : [],
                    specs: prod.specs || []
                },
                sortOrder: parseInt(prod.id.split('_')[1]) || 0
            });
        }
        console.log(`Created ${rawProducts.length} product pages.`);

        // 3. Load Solutions Data
        const solutionsFilePath = path.join(__dirname, '../../data/solutions.ts');
        if (fs.existsSync(solutionsFilePath)) {
            const solutionsContent = fs.readFileSync(solutionsFilePath, 'utf8');
            const solutionsMatch = solutionsContent.match(/export const solutionCategories: SolutionCategory\[\] = (\[[\s\S]*?\]);/);
            if (solutionsMatch) {
                const rawCategories = JSON.parse(solutionsMatch[1]);
                for (const cat of rawCategories) {
                    for (const sol of cat.solutions) {
                        await Page.create({
                            type: 'solution',
                            slug: sol.id.toLowerCase().replace(/_/g, '-'),
                            title: { zh: sol.title, en: sol.title },
                            subtitle: { zh: sol.bannerSubtitle || '', en: '' },
                            description: { zh: sol.summary || '', en: '' },
                            heroImage: sol.detailImage || 'https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173043997.png',
                            categoryId: createdCategories[`solution_${cat.id}`],
                            content: {
                                features: sol.features || [],
                                advantages: sol.advantages || [],
                                needs: sol.needs || [],
                                solutionDesc: sol.solutionDesc || ''
                            },
                            sortOrder: parseInt(sol.id.split('_')[1]) || 0
                        });
                    }
                }
                console.log('Created solution pages.');
            }
        }

        // 4. Create Navigation Items (Menu)
        const menuTree = [
            { title: { zh: '首页', en: 'Home' }, href: '/', sortOrder: 1 },
            { title: { zh: '产品中心', en: 'Products' }, href: '/products', sortOrder: 2, children: 'product_categories' },
            { title: { zh: '解决方案', en: 'Solutions' }, href: '/solutions', sortOrder: 3, children: 'solution_categories' },
            {
                title: { zh: '技术研究', en: 'Research' },
                href: '/research',
                sortOrder: 4,
                children: [
                    { title: { zh: '标准制定', en: 'Standards' }, href: '/research/standards' },
                    { title: { zh: '产学研用', en: 'Industry-University' }, href: '/research/industry-university' },
                    { title: { zh: '产业教育', en: 'Industrial Education' }, href: '/research/education' }
                ]
            },
            {
                title: { zh: '服务支持', en: 'Services' },
                href: '/services',
                sortOrder: 5,
                children: [
                    { title: { zh: '服务内容', en: 'Service Content' }, href: '/services/content' },
                    { title: { zh: '下载中心', en: 'Download Center' }, href: '/services/downloads' }
                ]
            },
            {
                title: { zh: '关于奥联', en: 'About OLYM' },
                href: '/about',
                sortOrder: 6,
                children: [
                    { title: { zh: '最新动态', en: 'News' }, href: '/about/news' },
                    { title: { zh: '关于奥联', en: 'About OLYM' }, href: '/about/profile' },
                    { title: { zh: '发展历程', en: 'History' }, href: '/about/history' },
                    { title: { zh: '荣誉资质', en: 'Honors' }, href: '/about/honors' },
                    { title: { zh: '招贤纳士', en: 'Careers' }, href: '/about/careers' },
                    { title: { zh: '联系我们', en: 'Contact Us' }, href: '/about/contact' }
                ]
            }
        ];

        for (const item of menuTree) {
            const parent = await NavigationItem.create({
                title: item.title,
                href: item.href,
                sortOrder: item.sortOrder,
                isActive: true
            });

            if (item.children === 'product_categories') {
                const cats = await PageCategory.findAll({ where: { type: 'product' }, order: [['sortOrder', 'ASC']] });
                for (const cat of cats) {
                    const subParent = await NavigationItem.create({
                        parentId: parent.id,
                        title: cat.title,
                        href: `/products?category=${cat.slug}`,
                        sortOrder: cat.sortOrder,
                        isActive: true
                    });

                    // Add products under this category as level 3
                    const pages = await Page.findAll({ where: { categoryId: cat.id }, order: [['sortOrder', 'ASC']] });
                    for (const pg of pages) {
                        await NavigationItem.create({
                            parentId: subParent.id,
                            pageId: pg.id,
                            title: pg.title,
                            href: `/products/${pg.slug}`,
                            sortOrder: pg.sortOrder,
                            isActive: true
                        });
                    }
                }
            } else if (item.children === 'solution_categories') {
                const cats = await PageCategory.findAll({ where: { type: 'solution' }, order: [['sortOrder', 'ASC']] });
                for (const cat of cats) {
                    const subParent = await NavigationItem.create({
                        parentId: parent.id,
                        title: cat.title,
                        href: `/solutions?category=${cat.slug}`,
                        sortOrder: cat.sortOrder,
                        isActive: true
                    });

                    // Add solutions under this category
                    const pages = await Page.findAll({ where: { categoryId: cat.id }, order: [['sortOrder', 'ASC']] });
                    for (const pg of pages) {
                        await NavigationItem.create({
                            parentId: subParent.id,
                            pageId: pg.id,
                            title: pg.title,
                            href: `/solutions/${pg.slug}`,
                            sortOrder: pg.sortOrder,
                            isActive: true
                        });
                    }
                }
            } else if (Array.isArray(item.children)) {
                for (const child of item.children) {
                    await NavigationItem.create({
                        parentId: parent.id,
                        title: child.title,
                        href: child.href,
                        sortOrder: 0,
                        isActive: true
                    });
                }
            }
        }

        console.log('Navigation items created.');
        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

sync();
