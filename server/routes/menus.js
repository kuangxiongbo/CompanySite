const express = require('express');
const router = express.Router();
const { NavigationItem, Page } = require('../models');
const { auth, admin } = require('../middleware/auth');

// Build nested tree from flat list
const buildTree = (items, parentId = null) => {
    return items
        .filter(item => item.parentId === parentId)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(item => ({
            ...item.toJSON(),
            children: buildTree(items, item.id)
        }));
};

// Get full menu tree (public - for frontend)
router.get('/', async (req, res) => {
    try {
        const items = await NavigationItem.findAll({
            where: { isActive: true },
            include: [{ model: Page, as: 'linkedPage', attributes: ['id', 'slug', 'type', 'title'] }],
            order: [['sortOrder', 'ASC']]
        });
        res.json(buildTree(items));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get ALL menu items (admin - flat list)
router.get('/all', auth, admin, async (req, res) => {
    try {
        const items = await NavigationItem.findAll({
            include: [{ model: Page, as: 'linkedPage', attributes: ['id', 'slug', 'type', 'title'] }],
            order: [['sortOrder', 'ASC']]
        });
        res.json(buildTree(items));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a menu item
router.post('/', auth, admin, async (req, res) => {
    try {
        const item = await NavigationItem.create(req.body);
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a menu item
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const item = await NavigationItem.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Menu item not found' });
        await item.update(req.body);
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a menu item (and its children)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const item = await NavigationItem.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Menu item not found' });
        // Delete children first
        await NavigationItem.destroy({ where: { parentId: item.id } });
        await item.destroy();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Reorder items (batch update sortOrder + parentId)
router.post('/reorder', auth, admin, async (req, res) => {
    try {
        const { items } = req.body; // [{ id, sortOrder, parentId }]
        for (const item of items) {
            await NavigationItem.update(
                { sortOrder: item.sortOrder, parentId: item.parentId },
                { where: { id: item.id } }
            );
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
