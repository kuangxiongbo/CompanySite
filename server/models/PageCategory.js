const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PageCategory = sequelize.define('PageCategory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: { // 'product', 'solution'
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
    description: { // { zh, en }
        type: DataTypes.JSON
    },
    config: { // UI config like icons, colors
        type: DataTypes.JSON,
        defaultValue: {}
    },
    sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: true
});

module.exports = PageCategory;
