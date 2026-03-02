const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NavigationItem = sequelize.define('NavigationItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    parentId: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    pageId: { // Optional link to a managed Page
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    title: { // Stores JSON string for i18n? e.g. {"en":"Home","zh":"首页"}
        type: DataTypes.JSON,
        allowNull: false
    },
    href: {
        type: DataTypes.STRING,
        defaultValue: '#'
    },
    sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    roles: { // Permissions required to see? e.g. ["admin","user"]
        type: DataTypes.JSON,
        defaultValue: []
    },
    config: { // Stores specific config for frontend such as image, top image for pages, featured components
        type: DataTypes.JSON,
        defaultValue: {}
    }
}, {
    timestamps: true
});

module.exports = NavigationItem;
