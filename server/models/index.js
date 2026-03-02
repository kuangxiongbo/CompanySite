const sequelize = require('../config/database');
const User = require('./User');
const News = require('./News');
const Page = require('./Page');
const PageCategory = require('./PageCategory');
const NavigationItem = require('./NavigationItem');
const Download = require('./Download');
const Lead = require('./Lead');
const SystemConfig = require('./SystemConfig');
const OperationLog = require('./OperationLog');

// Page <-> Category
Page.belongsTo(PageCategory, { foreignKey: 'categoryId', as: 'categoryInfo' });
PageCategory.hasMany(Page, { foreignKey: 'categoryId', as: 'pages' });

// NavigationItem <-> Page
NavigationItem.belongsTo(Page, { foreignKey: 'pageId', as: 'linkedPage' });
Page.hasMany(NavigationItem, { foreignKey: 'pageId' });

// NavigationItem self-reference (parent/children)
NavigationItem.hasMany(NavigationItem, { foreignKey: 'parentId', as: 'children' });
NavigationItem.belongsTo(NavigationItem, { foreignKey: 'parentId', as: 'parent' });

// OperationLog <-> User
OperationLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
    sequelize,
    User,
    News,
    Page,
    PageCategory,
    NavigationItem,
    Download,
    Lead,
    SystemConfig,
    OperationLog,
};
