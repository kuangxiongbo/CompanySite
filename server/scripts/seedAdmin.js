require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User } = require('../models');

async function seedAdmin() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established for seeding.');

        const adminEmail = 'admin@myibc.net'; // Updated email address
        const adminPassword = 'Gw1admin.';
        const adminRole = 'superadmin';

        let adminUser = await User.findOne({ where: { email: adminEmail } });

        if (adminUser) {
            console.log('Admin already exists, updating password...');
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            adminUser.password = hashedPassword;
            adminUser.role = adminRole;
            await adminUser.save();
            console.log('Admin password/role updated.');
        } else {
            console.log('Creating admin user...');
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await User.create({
                email: adminEmail,
                password: hashedPassword,
                role: adminRole,
                name: 'System Admin'
            });
            console.log('Admin user created successfully.');
        }

        // Also check if 'admin' exists just in case they meant the string 'admin'
        // If isEmail is strict, this will fail, so we wrap it.
        try {
            let simpleAdmin = await User.findOne({ where: { email: 'admin' } });
            if (!simpleAdmin) {
                const hashedPassword = await bcrypt.hash(adminPassword, 10);
                await User.create({
                    email: 'admin',
                    password: hashedPassword,
                    role: adminRole,
                    name: 'Admin Account'
                });
                console.log('Created simple "admin" account as well.');
            }
        } catch (e) {
            console.log('Could not create account with identifier "admin" (likely email validation). Use admin@olym.com instead.');
        }

    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await sequelize.close();
    }
}

seedAdmin();
