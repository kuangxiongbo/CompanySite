const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SystemConfig = sequelize.define('SystemConfig', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    key: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    value: { type: DataTypes.TEXT, allowNull: true },
    category: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'general' },
    label: { type: DataTypes.STRING(200), allowNull: true },
    type: { type: DataTypes.STRING(30), defaultValue: 'text' }, // text, json, boolean, password
    isSecret: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
    tableName: 'system_configs',
    timestamps: true
});

module.exports = SystemConfig;
