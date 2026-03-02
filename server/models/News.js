const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const News = sequelize.define('News', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.JSON, // { zh: "Title", en: "Title" }
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    category: { // company, industry
        type: DataTypes.STRING,
        defaultValue: 'company'
    },
    publishedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    summary: {
        type: DataTypes.JSON,
        allowNull: true
    },
    content: {
        type: DataTypes.JSON, // { zh: "<div>...</div>", en: "<div>...</div>" }
        allowNull: true
    },
    coverImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = News;
