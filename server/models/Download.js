const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Download = sequelize.define('Download', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.JSON, // { zh: "Name", en: "Name" }
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'PDF'
    },
    size: {
        type: DataTypes.STRING,
        allowNull: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: { // basic, whitepaper, sdk, etc.
        type: DataTypes.STRING,
        defaultValue: 'general'
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = Download;
