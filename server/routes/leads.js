const express = require('express');
const router = express.Router();
const { Lead, SystemConfig } = require('../models');
const { auth, admin } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Get transporter dynamically from SystemConfig
const getTransporter = async () => {
    const getVal = async (key) => {
        const c = await SystemConfig.findOne({ where: { key } });
        return c ? c.value : null;
    };
    const host = await getVal('smtp_host');
    const port = await getVal('smtp_port');
    const user = await getVal('smtp_user');
    const pass = await getVal('smtp_pass');
    if (!host || !user || !pass) return null;
    return nodemailer.createTransport({
        host, port: parseInt(port || '465'), secure: true,
        auth: { user, pass }
    });
};

// Public: Submit a lead
router.post('/submit', async (req, res) => {
    try {
        const { type, name, email, phone, company, message, sourceUrl } = req.body;
        const lead = await Lead.create({ type, name, email, phone, company, message, sourceUrl });

        // Send email notification asynchronously
        (async () => {
            try {
                const transporter = await getTransporter();
                const notifyEmails = await SystemConfig.findOne({ where: { key: 'notify_emails' } });
                const notifyOn = await SystemConfig.findOne({ where: { key: 'notify_on_lead' } });
                if (transporter && notifyEmails?.value && notifyOn?.value === 'true') {
                    await transporter.sendMail({
                        from: (await SystemConfig.findOne({ where: { key: 'smtp_from' } }))?.value || '',
                        to: notifyEmails.value,
                        subject: `【奥联官网】新商机提醒 - ${type}`,
                        html: `
                            <h2>您收到一条新的官方网站商机</h2>
                            <table border="1" cellpadding="8" cellspacing="0">
                                <tr><td><strong>类型</strong></td><td>${type}</td></tr>
                                <tr><td><strong>姓名</strong></td><td>${name}</td></tr>
                                <tr><td><strong>邮箱</strong></td><td>${email}</td></tr>
                                <tr><td><strong>电话</strong></td><td>${phone || '未提供'}</td></tr>
                                <tr><td><strong>公司</strong></td><td>${company || '未提供'}</td></tr>
                                <tr><td><strong>来源</strong></td><td>${sourceUrl || '未知'}</td></tr>
                                <tr><td><strong>留言</strong></td><td>${message || '无'}</td></tr>
                            </table>
                        `
                    });
                }
            } catch (e) {
                console.error('Email notification failed:', e);
            }
        })();

        res.status(201).json({ message: 'Lead submitted successfully', id: lead.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Get leads with pagination + type filter
router.get('/', auth, admin, async (req, res) => {
    try {
        const { page = 1, limit = 20, status, type } = req.query;
        const where = {};
        if (status) where.status = status;
        if (type) where.type = type;

        const { count, rows } = await Lead.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
        });
        res.json({ total: count, page: parseInt(page), leads: rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Update lead status
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const lead = await Lead.findByPk(req.params.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        await lead.update({ status: req.body.status, note: req.body.note });
        res.json(lead);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Delete lead
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        await Lead.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
