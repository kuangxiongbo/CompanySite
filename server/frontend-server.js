
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 3003;

// Proxy API requests to backend
// Note: We use 127.0.0.1 explicitly to avoid IPv6 issues
app.use('/api', createProxyMiddleware({
    target: 'http://127.0.0.1:3000',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api', // keep /api prefix
    },
}));

// Serve static files from React build (root dist folder)
const DIS_DIR = path.join(__dirname, '../dist');
app.use(express.static(DIS_DIR));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(DIS_DIR, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend server is running on port ${PORT}`);
});
