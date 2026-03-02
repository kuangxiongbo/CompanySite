const express = require('express');
const router = express.Router();
const { PageCategory, Page } = require('../models');
const { auth, admin } = require('../middleware/auth');

// Get all categories
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        const where = {};
        if (type) where.type = type;

        const categories = await PageCategory.findAll({
            where,
            include: [{
                model: Page,
                as: 'pages',
                where: { isActive: true },
                required: false
            }],
            order: [['sortOrder', 'ASC']]
        });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create category (admin)
router.post('/', auth, admin, async (req, res) => {
    try {
        const category = await PageCategory.create(req.body);
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update category (admin)
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const category = await PageCategory.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        await category.update(req.body);
        res.json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
