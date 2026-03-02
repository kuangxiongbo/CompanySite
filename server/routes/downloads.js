const express = require('express');
const router = express.Router();
const { Download } = require('../models');
const { auth, admin } = require('../middleware/auth');

// Get all downloads (public)
router.get('/', async (req, res) => {
    try {
        const downloads = await Download.findAll({
            where: { isPublic: true },
            order: [['createdAt', 'DESC']]
        });
        res.json(downloads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create download (admin)
router.post('/', auth, admin, async (req, res) => {
    try {
        const download = await Download.create(req.body);
        res.status(201).json(download);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update download (admin)
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const download = await Download.findByPk(req.params.id);
        if (!download) return res.status(404).json({ message: 'Download not found' });
        await download.update(req.body);
        res.json(download);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete download (admin)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const download = await Download.findByPk(req.params.id);
        if (!download) return res.status(404).json({ message: 'Download not found' });
        await download.destroy();
        res.json({ message: 'Download deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
