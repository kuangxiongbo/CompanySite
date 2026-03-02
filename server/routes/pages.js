const express = require('express');
const router = express.Router();
const { Page, PageCategory } = require('../models');
const { auth, admin } = require('../middleware/auth');

// Get all pages
router.get('/', async (req, res) => {
    try {
        const { type, categoryId, categorySlug, all } = req.query;
        const where = {};
        if (!all) where.isActive = true;  // admin can pass ?all=1 to get inactive too
        if (type) where.type = type;

        const include = [];
        if (categoryId) {
            where.categoryId = categoryId;
        } else if (categorySlug) {
            include.push({
                model: PageCategory,
                as: 'categoryInfo',
                where: { slug: categorySlug }
            });
        } else {
            include.push({
                model: PageCategory,
                as: 'categoryInfo'
            });
        }

        const pages = await Page.findAll({
            where,
            include,
            order: [['sortOrder', 'ASC'], ['id', 'ASC']]
        });
        res.json(pages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Get page by slug or name
router.get('/detail', async (req, res) => {
    try {
        const { slug, name } = req.query;
        let page;
        if (slug) {
            page = await Page.findOne({ where: { slug, isActive: true }, include: ['categoryInfo'] });
        } else if (name) {
            // Check title JSON for name (simplified)
            // In a real app we'd use a more robust JSON search
            const allPages = await Page.findAll({ include: ['categoryInfo'] });
            page = allPages.find(p => p.title.zh === name || p.title.en === name);
        }

        if (!page) return res.status(404).json({ message: 'Page not found' });
        res.json(page);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create page (admin)
router.post('/', auth, admin, async (req, res) => {
    try {
        const page = await Page.create(req.body);
        res.status(201).json(page);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update page (admin)
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const page = await Page.findByPk(req.params.id);
        if (!page) return res.status(404).json({ message: 'Page not found' });
        await page.update(req.body);
        res.json(page);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete page (admin)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const page = await Page.findByPk(req.params.id);
        if (!page) return res.status(404).json({ message: 'Page not found' });
        await page.destroy();
        res.json({ message: 'Page deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
