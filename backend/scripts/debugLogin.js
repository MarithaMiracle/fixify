#!/usr/bin/env node

// scripts/debugLogin.js
// Debug script to check user credentials and fix login issues

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { User, sequelize } = require('../models');
const bcrypt = require('bcrypt');

console.log('\n🔍 Debugging Login Issues...\n');

async function debugLogin() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established');

        // Check if test users exist
        console.log('\n📋 Checking test users...');

        const testEmails = [
            'sarah.adebayo.test@fixify.com',
            'michael.okafor.test@fixify.com',
            'fatima.ibrahim.test@fixify.com',
            'james.okonkwo.test@fixify.com',
            'provider.demo@fixify.com'
        ];

        for (const email of testEmails) {
            const user = await User.findOne({ where: { email } });

            if (user) {
                console.log(`✅ Found user: ${email}`);
                console.log(`   - ID: ${user.id}`);
                console.log(`   - Role: ${user.role || 'user'}`);
                console.log(`   - Active: ${user.isActive}`);
                console.log(`   - Email Verified: ${user.isEmailVerified}`);
                console.log(`   - Password Hash Length: ${user.password ? user.password.length : 'No password'}`);

                // Test password verification
                if (user.password) {
                    const testPassword = email.includes('provider') ? 'SecurePass123!' : 'customer123';
                    const isValid = await bcrypt.compare(testPassword, user.password);
                    console.log(`   - Password Test (${testPassword}): ${isValid ? '✅ VALID' : '❌ INVALID'}`);

                    if (!isValid) {
                        console.log(`   - ⚠️  Password hash mismatch detected for ${email}`);
                    }
                }
                console.log('');
            } else {
                console.log(`❌ User not found: ${email}`);
            }
        }

        // Check for any users that might match partially
        console.log('\n🔍 Checking for similar email patterns...');
        const allUsers = await User.findAll({
            attributes: ['email', 'role', 'isActive'],
            where: {
                email: {
                    [sequelize.Sequelize.Op.iLike]: '%test%'
                }
            }
        });

        if (allUsers.length > 0) {
            console.log('Found users with "test" in email:');
            allUsers.forEach(user => {
                console.log(`  - ${user.email} (${user.role || 'user'}) - Active: ${user.isActive}`);
            });
        } else {
            console.log('No users found with "test" in email');
        }

    } catch (error) {
        console.error('❌ Debug error:', error);
    }
}

async function fixLoginIssues() {
    try {
        console.log('\n🔧 Fixing login issues...\n');

        // Re-hash passwords with correct values
        const updates = [
            { email: 'sarah.adebayo.test@fixify.com', password: 'customer123' },
            { email: 'michael.okafor.test@fixify.com', password: 'customer123' },
            { email: 'fatima.ibrahim.test@fixify.com', password: 'customer123' },
            { email: 'james.okonkwo.test@fixify.com', password: 'customer123' },
            { email: 'provider.demo@fixify.com', password: 'SecurePress123!' }
        ];

        for (const update of updates) {
            const user = await User.findOne({ where: { email: update.email } });

            if (user) {
                // Hash the password properly
                const hashedPassword = await bcrypt.hash(update.password, 12);

                // Update the user
                await user.update({
                    password: hashedPassword,
                    isActive: true,
                    isEmailVerified: true
                });

                // Verify the update worked
                const isValid = await bcrypt.compare(update.password, hashedPassword);
                console.log(`✅ Updated password for ${update.email}: ${isValid ? 'SUCCESS' : 'FAILED'}`);
            } else {
                console.log(`❌ User not found for update: ${update.email}`);
            }
        }

        console.log('\n🎉 Password fixes completed!');

    } catch (error) {
        console.error('❌ Fix error:', error);
    }
}

async function createMissingUsers() {
    try {
        console.log('\n👤 Creating missing test users...\n');

        const usersToCreate = [{
                fullName: 'Sarah Adebayo',
                email: 'sarah.adebayo.test@fixify.com',
                phone: '+2348987654321',
                password: 'customer123',
                role: 'user'
            },
            {
                fullName: 'Michael Okafor',
                email: 'michael.okafor.test@fixify.com',
                phone: '+2348876543210',
                password: 'customer123',
                role: 'user'
            },
            {
                fullName: 'Fatima Ibrahim',
                email: 'fatima.ibrahim.test@fixify.com',
                phone: '+2348765432109',
                password: 'customer123',
                role: 'user'
            },
            {
                fullName: 'James Okonkwo',
                email: 'james.okonkwo.test@fixify.com',
                phone: '+2348654321098',
                password: 'customer123',
                role: 'user'
            },
            {
                fullName: 'David Johnson',
                email: 'provider.demo@fixify.com',
                phone: '+2348123456789',
                password: 'SecurePass123!',
                role: 'provider'
            }
        ];

        for (const userData of usersToCreate) {
            // Check if user already exists
            const existingUser = await User.findOne({ where: { email: userData.email } });

            if (!existingUser) {
                // Hash password
                const hashedPassword = await bcrypt.hash(userData.password, 12);

                // Create user
                const newUser = await User.create({
                    id: generateUUID(),
                    fullName: userData.fullName,
                    email: userData.email,
                    phone: userData.phone,
                    password: hashedPassword,
                    role: userData.role,
                    isActive: true,
                    isEmailVerified: true,
                    isPhoneVerified: true,
                    walletBalance: userData.role === 'provider' ? 45000 : 50000,
                    address: {
                        street: '123 Test Street',
                        city: 'Lagos',
                        state: 'Lagos',
                        country: 'Nigeria'
                    }
                });

                console.log(`✅ Created user: ${newUser.email}`);
            } else {
                console.log(`ℹ️  User already exists: ${userData.email}`);
            }
        }

    } catch (error) {
        console.error('❌ Create users error:', error);
    }
}

// Helper function to generate UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function runDiagnostics() {
    console.log('🏥 Running Login Diagnostics...\n');

    try {
        // Step 1: Debug current state
        await debugLogin();

        // Step 2: Create missing users
        await createMissingUsers();

        // Step 3: Fix password issues  
        await fixLoginIssues();

        // Step 4: Final verification
        console.log('\n✅ Final verification...');
        await debugLogin();

        console.log('\n🎯 READY TO TEST:');
        console.log('👤 Customer Login:');
        console.log('   Email: sarah.adebayo.test@fixify.com');
        console.log('   Password: customer123');
        console.log('');
        console.log('🏢 Provider Login:');
        console.log('   Email: provider.demo@fixify.com');
        console.log('   Password: SecurePass123!');
        console.log('');
        console.log('🌐 Try logging in at: http://localhost:3000/auth');

    } catch (error) {
        console.error('❌ Diagnostics failed:', error);
    } finally {
        process.exit(0);
    }
}

// Run diagnostics if called directly
if (require.main === module) {
    runDiagnostics();
}

module.exports = { debugLogin, fixLoginIssues, createMissingUsers };