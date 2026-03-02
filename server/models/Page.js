const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Page = sequelize.define('Page', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: { // 'product', 'solution', 'service', 'other'
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        unique: true
    },
    title: { // { zh, en }
        type: DataTypes.JSON,
        allowNull: false
    },
    subtitle: { // { zh, en }
        type: DataTypes.JSON
    },
    heroImage: {
        type: DataTypes.STRING
    },
    bannerSubtitle: { // { zh, en }
        type: DataTypes.JSON
    },
    description: { // { zh, en }
        type: DataTypes.JSON
    },
    // Main content structure - stores sections like features, advantages, use cases
    // This allows the frontend components to map fields easily
    content: {
        type: DataTypes.JSON,
        defaultValue: {
            features: [], // [{ title: {zh, en}, desc: {zh, en} }]
            advantages: [],
            useCases: [],
            specs: [],
            highlights: []
        }
    },
    config: { // UI configuration flags
        type: DataTypes.JSON,
        defaultValue: {}
    },
    categoryId: {
        type: DataTypes.INTEGER
    },
    tag: { // e.g. "HOT", "NEW"
        type: DataTypes.STRING
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: true
});

module.exports = Page;
