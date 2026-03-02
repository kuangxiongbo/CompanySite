const express = require('express');
const router = express.Router();
const { SystemConfig } = require('../models');
const { auth, admin } = require('../middleware/auth');

// Default config keys to seed if missing
const DEFAULT_CONFIGS = [
    // General
    { key: 'site_name', value: '奥联科技', category: 'general', label: '网站名称', type: 'text' },
    { key: 'site_logo', value: '', category: 'general', label: '网站Logo URL', type: 'text' },
    { key: 'site_theme', value: 'default', category: 'general', label: '网站主题', type: 'select' },
    { key: 'site_icp', value: '', category: 'general', label: 'ICP备案号', type: 'text' },
    // Email
    { key: 'smtp_host', value: '', category: 'email', label: 'SMTP服务器', type: 'text' },
    { key: 'smtp_port', value: '465', category: 'email', label: 'SMTP端口', type: 'text' },
    { key: 'smtp_user', value: '', category: 'email', label: 'SMTP用户名', type: 'text' },
    { key: 'smtp_pass', value: '', category: 'email', label: 'SMTP密码', type: 'password', isSecret: true },
    { key: 'smtp_from', value: '', category: 'email', label: '发件人邮箱', type: 'text' },
    { key: 'notify_emails', value: '', category: 'email', label: '通知邮箱(逗号分隔)', type: 'text' },
    { key: 'notify_on_lead', value: 'true', category: 'email', label: '新商机邮件通知', type: 'boolean' },
    // AI
    { key: 'ai_provider', value: 'openai', category: 'ai', label: 'AI 提供商', type: 'select' },
    { key: 'openai_api_key', value: '', category: 'ai', label: 'OpenAI API Key', type: 'password', isSecret: true },
    { key: 'openai_model', value: 'gpt-4o', category: 'ai', label: 'OpenAI 模型', type: 'text' },
    { key: 'deepseek_api_key', value: '', category: 'ai', label: 'DeepSeek API Key', type: 'password', isSecret: true },
    { key: 'deepseek_model', value: 'deepseek-chat', category: 'ai', label: 'DeepSeek 模型', type: 'text' },
    { key: 'qwen_api_key', value: '', category: 'ai', label: '通义千问 API Key', type: 'password', isSecret: true },
    { key: 'ai_system_prompt', value: '你是奥联科技的客服助手，专注于解答密码安全相关问题。', category: 'ai', label: 'AI 系统提示词', type: 'textarea' },
    // Security
    { key: 'allow_registration', value: 'false', category: 'security', label: '允许用户注册', type: 'boolean' },
    { key: 'session_timeout', value: '1440', category: 'security', label: '会话超时(分钟)', type: 'text' },
];

// Get public configs for frontend
router.get('/public', async (req, res) => {
    try {
        const publicKeys = ['site_name', 'site_logo', 'site_theme', 'site_icp'];
        const configs = await SystemConfig.findAll({
            where: { key: publicKeys }
        });
        const result = {};
        configs.forEach(c => result[c.key] = c.value);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all configs (by category)
router.get('/', auth, admin, async (req, res) => {
    try {
        const { category } = req.query;
        const where = category ? { category } : {};
        let configs = await SystemConfig.findAll({ where });

        // Seed defaults if empty
        if (configs.length === 0) {
            await SystemConfig.bulkCreate(DEFAULT_CONFIGS, { ignoreDuplicates: true });
            configs = await SystemConfig.findAll({ where });
        }

        // Hide secret values from response
        const safeConfigs = configs.map(c => {
            const obj = c.toJSON();
            if (obj.isSecret && obj.value) obj.value = '••••••••';
            return obj;
        });

        res.json(safeConfigs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a single config
router.put('/:key', auth, admin, async (req, res) => {
    try {
        const { value } = req.body;
        const [config, created] = await SystemConfig.findOrCreate({
            where: { key: req.params.key },
            defaults: { value, category: 'general', type: 'text' }
        });
        if (!created) {
            await config.update({ value });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Bulk update configs
router.post('/bulk', auth, admin, async (req, res) => {
    try {
        const { configs } = req.body; // { key: value, ... }
        for (const [key, value] of Object.entries(configs)) {
            await SystemConfig.upsert({ key, value });
        }
        res.json({ success: true, message: '设置已保存' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Seed defaults
router.post('/seed', auth, admin, async (req, res) => {
    try {
        await SystemConfig.bulkCreate(DEFAULT_CONFIGS, { ignoreDuplicates: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
