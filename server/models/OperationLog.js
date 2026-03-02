const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OperationLog = sequelize.define('OperationLog', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    username: { type: DataTypes.STRING(100), allowNull: true },
    action: { type: DataTypes.STRING(100), allowNull: false }, // CREATE, UPDATE, DELETE, LOGIN, etc.
    resource: { type: DataTypes.STRING(100), allowNull: true }, // menus, pages, news, etc.
    resourceId: { type: DataTypes.STRING(50), allowNull: true },
    detail: { type: DataTypes.TEXT, allowNull: true },
    ip: { type: DataTypes.STRING(50), allowNull: true },
    userAgent: { type: DataTypes.STRING(500), allowNull: true },
    status: { type: DataTypes.STRING(20), defaultValue: 'success' }, // success, failed
}, {
    tableName: 'operation_logs',
    timestamps: true,
    updatedAt: false,
});

module.exports = OperationLog;
