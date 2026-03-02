const express = require('express');
const router = express.Router();
const { OperationLog, User } = require('../models');
const { auth, admin } = require('../middleware/auth');

// Get operation logs (paginated)
router.get('/', auth, admin, async (req, res) => {
    try {
        const { page = 1, limit = 50, action, resource } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const where = {};
        if (action) where.action = action;
        if (resource) where.resource = resource;

        const { count, rows } = await OperationLog.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset,
        });

        res.json({ total: count, page: parseInt(page), logs: rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Clear old logs (keep last 1000)
router.delete('/clear', auth, admin, async (req, res) => {
    try {
        const count = await OperationLog.count();
        if (count > 1000) {
            const toDelete = await OperationLog.findAll({
                order: [['createdAt', 'ASC']],
                limit: count - 1000,
            });
            await OperationLog.destroy({ where: { id: toDelete.map(l => l.id) } });
        }
        res.json({ success: true, message: '日志已清理' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
