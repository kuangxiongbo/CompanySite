const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { auth, admin, superadmin } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', auth, admin, async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update role (superadmin only)
router.put('/:id/role', auth, superadmin, async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin', 'superadmin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.role = role;
        await user.save();
        res.json({ message: 'Role updated', user: { id: user.id, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
