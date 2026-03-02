const express = require('express');
const router = express.Router();
const { News } = require('../models');
const { auth, admin } = require('../middleware/auth');

// Get all news (public)
router.get('/', async (req, res) => {
    try {
        const news = await News.findAll({
            where: { isPublished: true },
            order: [['publishedAt', 'DESC']]
        });
        res.json(news);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all news (admin - includes unpublished)
router.get('/all', auth, admin, async (req, res) => {
    try {
        const news = await News.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(news);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get news by id (public)
router.get('/:id(\\d+)', async (req, res) => {
    try {
        const news = await News.findByPk(req.params.id);
        if (!news) return res.status(404).json({ message: 'News not found' });
        res.json(news);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create news (admin)
router.post('/', auth, admin, async (req, res) => {
    try {
        const news = await News.create(req.body);
        res.status(201).json(news);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update news (admin)
router.put('/:id(\\d+)', auth, admin, async (req, res) => {
    try {
        const news = await News.findByPk(req.params.id);
        if (!news) return res.status(404).json({ message: 'News not found' });
        await news.update(req.body);
        res.json(news);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete news (admin)
router.delete('/:id(\\d+)', auth, admin, async (req, res) => {
    try {
        const news = await News.findByPk(req.params.id);
        if (!news) return res.status(404).json({ message: 'News not found' });
        await news.destroy();
        res.json({ message: 'News deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
