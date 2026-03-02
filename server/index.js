require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const newsRoutes = require('./routes/news');
const menuRoutes = require('./routes/menus');
const pageRoutes = require('./routes/pages');
const pageCategoryRoutes = require('./routes/pageCategories');
const downloadRoutes = require('./routes/downloads');
const leadRoutes = require('./routes/leads');
const settingsRoutes = require('./routes/settings');
const logsRoutes = require('./routes/logs');
const syncRoutes = require('./routes/sync');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/page-categories', pageCategoryRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/sync', syncRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    sequelize.sync({ force: false })
        .then(() => {
            console.log('Database synced');
        })
        .catch(err => {
            console.error('Database connection failed:', err);
        });
});
