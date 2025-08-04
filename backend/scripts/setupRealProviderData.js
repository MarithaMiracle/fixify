#!/usr/bin/env node

// scripts/setupRealProviderData.js
// This script sets up real, working provider data for testing
// Run with: node scripts/setupRealProviderData.js

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const {
    User,
    Provider,
    Service,
    ServiceCategory,
    Booking,
    Payment,
    Review,
    WalletTransaction,
    sequelize
} = require('../models');
const bcrypt = require('bcrypt');

console.log('\n🔧 Setting up real provider data for your dashboard...\n');

// Helper function to generate proper UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Helper function to generate slug from name
function generateSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
}

async function clearExistingTestData() {
    console.log('\n🧹 Clearing existing test data...');

    try {
        // Define test emails to remove (only the new ones we're about to create)
        const testEmails = [
            'sarah.adebayo.test@fixify.com',
            'michael.okafor.test@fixify.com',
            'fatima.ibrahim.test@fixify.com',
            'james.okonkwo.test@fixify.com',
            'provider.demo@fixify.com'
        ];

        // Delete users with test emails
        const deletedUsers = await User.destroy({
            where: {
                email: testEmails
            }
        });

        if (deletedUsers > 0) {
            console.log(`✅ Cleared ${deletedUsers} existing test users`);
        } else {
            console.log('ℹ️  No existing test data to clear');
        }

    } catch (error) {
        console.log('ℹ️  No existing test data to clear or error occurred:', error.message);
    }
}

async function setupRealProviderData() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully');

        // Sync all models (create tables if they don't exist)
        await sequelize.sync({ alter: true });
        console.log('✅ Database models synchronized');

        // Clear existing test data first
        await clearExistingTestData();

        // 1. Create Service Categories
        console.log('\n📁 Creating service categories...');
        const categories = await createServiceCategories();
        console.log(`✅ Created ${categories.length} service categories`);

        // 2. Create Provider User Account
        console.log('\n👤 Creating provider user account...');
        const providerUser = await createProviderUser();
        console.log(`✅ Provider user created: ${providerUser.email}`);

        // 3. Create Provider Profile
        console.log('\n🏢 Creating provider profile...');
        const provider = await createProviderProfile(providerUser.id);
        console.log(`✅ Provider profile created: ${provider.businessName}`);

        // 4. Create Services
        console.log('\n🛠️  Creating provider services...');
        const services = await createServices(provider.id, categories);
        console.log(`✅ Created ${services.length} services`);

        // 5. Create Customer Accounts
        console.log('\n👥 Creating customer accounts...');
        const customers = await createCustomers();
        console.log(`✅ Created ${customers.length} customer accounts`);

        // 6. Create Bookings
        console.log('\n📅 Creating bookings...');
        const bookings = await createBookings(customers, provider.id, services);
        console.log(`✅ Created ${bookings.length} bookings`);

        // 7. Create Payments
        console.log('\n💳 Creating payments...');
        const payments = await createPayments(bookings);
        console.log(`✅ Created ${payments.length} payments`);

        // 8. Create Reviews
        console.log('\n⭐ Creating reviews...');
        const reviews = await createReviews(customers, provider.id, bookings);
        console.log(`✅ Created ${reviews.length} reviews`);

        // 9. Create Wallet Transactions
        console.log('\n💰 Creating wallet transactions...');
        const transactions = await createWalletTransactions(providerUser.id, payments);
        console.log(`✅ Created ${transactions.length} wallet transactions`);

        // 10. Update Provider Statistics
        console.log('\n📊 Updating provider statistics...');
        await updateProviderStats(provider, bookings, reviews);
        console.log('✅ Provider statistics updated');

        console.log('\n🎉 Real provider data setup completed successfully!\n');
        console.log('📋 LOGIN CREDENTIALS:');
        console.log('   Email: provider.demo@fixify.com');
        console.log('   Password: SecurePass123!');
        console.log('\n📊 DATA SUMMARY:');
        console.log(`   ✓ Services: ${services.length}`);
        console.log(`   ✓ Bookings: ${bookings.length}`);
        console.log(`   ✓ Reviews: ${reviews.length}`);
        console.log(`   ✓ Payments: ${payments.length}`);
        console.log(`   ✓ Customers: ${customers.length}`);
        console.log('\n🚀 You can now log in to see your dashboard with real data!');

    } catch (error) {
        console.error('❌ Error setting up provider data:', error);
        throw error;
    }
}

async function createServiceCategories() {
    const categoryData = [{
            id: '11111111-1111-1111-1111-111111111111',
            name: 'Home Cleaning',
            slug: generateSlug('Home Cleaning'), // home-cleaning
            description: 'Professional home cleaning and maintenance services',
            imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center',
            isActive: true
        },
        {
            id: '22222222-2222-2222-2222-222222222222',
            name: 'Electrical Services',
            slug: generateSlug('Electrical Services'), // electrical-services
            description: 'Electrical repairs, installations, and maintenance',
            imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop&crop=center',
            isActive: true
        },
        {
            id: '33333333-3333-3333-3333-333333333333',
            name: 'Plumbing',
            slug: generateSlug('Plumbing'), // plumbing
            description: 'Plumbing repairs, installations, and pipe work',
            imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop&crop=center',
            isActive: true
        },
        {
            id: '44444444-4444-4444-4444-444444444444',
            name: 'AC Repair & Installation',
            slug: generateSlug('AC Repair & Installation'), // ac-repair-installation
            description: 'Air conditioning services and HVAC maintenance',
            imageUrl: 'https://images.unsplash.com/photo-1631545877027-ac9c0b2b1221?w=400&h=300&fit=crop&crop=center',
            isActive: true
        },
        {
            id: '55555555-5555-5555-5555-555555555555',
            name: 'Carpentry',
            slug: generateSlug('Carpentry'), // carpentry
            description: 'Wood work, furniture repair, and custom carpentry',
            imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop&crop=center',
            isActive: true
        }
    ];

    return await ServiceCategory.bulkCreate(categoryData, {
        ignoreDuplicates: true,
        returning: true
    });
}

async function createProviderUser() {
    const hashedPassword = await bcrypt.hash('SecurePass123!', 12);

    const [user, created] = await User.findOrCreate({
        where: { email: 'provider.demo@fixify.com' },
        defaults: {
            id: generateUUID(), // Use proper UUID generator
            fullName: 'David Johnson',
            email: 'provider.demo@fixify.com',
            phone: '+2348123456789',
            password: hashedPassword,
            role: 'provider', // Changed from isProvider to role 
            isActive: true,
            isEmailVerified: true, // Changed from isVerified
            isPhoneVerified: true,
            profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
            address: {
                street: '15 Victoria Island Street',
                city: 'Lagos',
                state: 'Lagos',
                country: 'Nigeria',
                postalCode: '101001'
            },
            walletBalance: 45000
        }
    });

    if (created) {
        console.log(`✅ Created new provider user: ${user.email}`);
    } else {
        console.log(`ℹ️  Provider user already exists: ${user.email} - using existing`);
    }

    return user;
}

async function createProviderProfile(userId) {
    const [provider, created] = await Provider.findOrCreate({
        where: { userId },
        defaults: {
            id: generateUUID(), // Use proper UUID generator
            userId,
            businessName: 'Johnson Professional Services',
            bio: 'Experienced professional with over 10 years in home maintenance and repair services. Specializing in electrical work, plumbing, AC repair, and general home improvements. Licensed, insured, and committed to excellent customer service. Available 7 days a week for emergency repairs.',
            skills: [
                'Electrical Installation & Repair',
                'Plumbing & Pipe Work',
                'AC Installation & Maintenance',
                'Home Cleaning',
                'Carpentry & Wood Work',
                'General Maintenance'
            ],
            experience: 10,
            hourlyRate: 8000,
            isVerified: true,
            isAvailable: true,
            averageRating: 4.8,
            totalReviews: 0, // Will be updated later
            completedJobs: 0, // Will be updated later
            workingHours: {
                monday: { start: '08:00', end: '18:00', available: true },
                tuesday: { start: '08:00', end: '18:00', available: true },
                wednesday: { start: '08:00', end: '18:00', available: true },
                thursday: { start: '08:00', end: '18:00', available: true },
                friday: { start: '08:00', end: '18:00', available: true },
                saturday: { start: '09:00', end: '17:00', available: true },
                sunday: { start: '10:00', end: '16:00', available: true }
            },
            serviceRadius: 30,
            portfolio: [{
                    title: 'Modern Kitchen Electrical Installation',
                    description: 'Complete electrical wiring for a modern kitchen renovation',
                    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
                    completedDate: '2024-06-15'
                },
                {
                    title: 'Bathroom Plumbing Renovation',
                    description: 'Full bathroom plumbing system upgrade and installation',
                    imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop',
                    completedDate: '2024-05-20'
                },
                {
                    title: 'Central AC System Installation',
                    description: 'Installation of central air conditioning system for 3-bedroom apartment',
                    imageUrl: 'https://images.unsplash.com/photo-1631545877027-ac9c0b2b1221?w=400&h=300&fit=crop',
                    completedDate: '2024-07-10'
                }
            ],
            verificationDocuments: {
                governmentId: 'verified',
                businessLicense: 'verified',
                insurance: 'verified',
                certifications: ['Electrical License', 'Plumbing Certification', 'HVAC Certification']
            },
            bankDetails: {
                bankName: 'GTBank',
                accountNumber: '0123456789',
                accountName: 'David Johnson',
                accountType: 'Savings'
            }
        }
    });

    return provider;
}

async function createServices(providerId, categories) {
    const servicesData = [{
            id: generateUUID(),
            providerId,
            categoryId: categories.find(c => c.name === 'Electrical Services').id,
            title: 'Electrical Wiring & Installation',
            description: 'Complete electrical wiring, outlet installation, switch replacement, and electrical repairs for homes and offices. Includes circuit breaker installation and electrical safety inspections.',
            price: 25000,
            duration: 120, // 2 hours in minutes
            images: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop&crop=center'],
            requirements: ['Basic electrical tools', 'Safety equipment'],
            isActive: true
        },
        {
            id: generateUUID(),
            providerId,
            categoryId: categories.find(c => c.name === 'Plumbing').id,
            title: 'Professional Plumbing Services',
            description: 'Expert plumbing services including pipe repairs, leak fixes, toilet installation, sink installation, and bathroom renovations. Emergency plumbing services available.',
            price: 20000,
            duration: 90, // 1.5 hours in minutes
            images: ['https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop&crop=center'],
            requirements: ['Plumbing tools', 'Replacement parts if needed'],
            isActive: true
        },
        {
            id: generateUUID(),
            providerId,
            categoryId: categories.find(c => c.name === 'AC Repair & Installation').id,
            title: 'AC Installation & Maintenance',
            description: 'Professional air conditioning installation, repair, and maintenance services. Includes split AC, window AC, and central AC systems. Regular maintenance packages available.',
            price: 35000,
            duration: 180, // 3 hours in minutes
            images: ['https://images.unsplash.com/photo-1631545877027-ac9c0b2b1221?w=600&h=400&fit=crop&crop=center'],
            requirements: ['AC unit (if new installation)', 'Power source access'],
            isActive: true
        },
        {
            id: generateUUID(),
            providerId,
            categoryId: categories.find(c => c.name === 'Home Cleaning').id,
            title: 'Deep Home Cleaning Service',
            description: 'Comprehensive deep cleaning service for homes including all rooms, kitchen, bathrooms, and appliances. Uses eco-friendly cleaning products and professional equipment.',
            price: 15000,
            duration: 240, // 4 hours in minutes
            images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&crop=center'],
            requirements: ['Access to all rooms', 'Water and electricity access'],
            isActive: true
        },
        {
            id: generateUUID(),
            providerId,
            categoryId: categories.find(c => c.name === 'Carpentry').id,
            title: 'Custom Carpentry & Wood Work',
            description: 'Professional carpentry services including custom furniture, cabinet installation, door and window frames, and general wood repairs. Quality craftsmanship guaranteed.',
            price: 30000,
            duration: 300, // 5 hours in minutes
            images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop&crop=center'],
            requirements: ['Wood materials', 'Workspace access', 'Measurements and specifications'],
            isActive: true
        }
    ];

    return await Service.bulkCreate(servicesData, {
        ignoreDuplicates: true,
        returning: true
    });
}

async function createCustomers() {
    const hashedPassword = await bcrypt.hash('customer123', 10);

    // Create customers one by one using findOrCreate to ensure they exist
    const customers = [];

    const customersData = [{
            id: generateUUID(), // Use proper UUID generator
            fullName: 'Sarah Adebayo',
            email: 'sarah.adebayo.test@fixify.com',
            phone: '+2348987654321',
            password: hashedPassword,
            role: 'user',
            isActive: true,
            isEmailVerified: true,
            isPhoneVerified: true,
            profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c4?w=300&h=300&fit=crop&crop=face',
            address: {
                street: '23 Admiralty Way',
                city: 'Lagos',
                state: 'Lagos',
                country: 'Nigeria'
            },
            walletBalance: 50000
        },
        {
            id: generateUUID(), // Use proper UUID generator
            fullName: 'Michael Okafor',
            email: 'michael.okafor.test@fixify.com',
            phone: '+2348876543210',
            password: hashedPassword,
            role: 'user',
            isActive: true,
            isEmailVerified: true,
            isPhoneVerified: true,
            profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
            address: {
                street: '45 Ikoyi Crescent',
                city: 'Lagos',
                state: 'Lagos',
                country: 'Nigeria'
            },
            walletBalance: 75000
        },
        {
            id: generateUUID(), // Use proper UUID generator
            fullName: 'Fatima Ibrahim',
            email: 'fatima.ibrahim.test@fixify.com',
            phone: '+2348765432109',
            password: hashedPassword,
            role: 'user',
            isActive: true,
            isEmailVerified: true,
            isPhoneVerified: true,
            profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
            address: {
                street: '12 Surulere Road',
                city: 'Lagos',
                state: 'Lagos',
                country: 'Nigeria'
            },
            walletBalance: 30000
        },
        {
            id: generateUUID(), // Use proper UUID generator
            fullName: 'James Okonkwo',
            email: 'james.okonkwo.test@fixify.com',
            phone: '+2348654321098',
            password: hashedPassword,
            role: 'user',
            isActive: true,
            isEmailVerified: true,
            isPhoneVerified: true,
            profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
            address: {
                street: '8 Lekki Phase 1',
                city: 'Lagos',
                state: 'Lagos',
                country: 'Nigeria'
            },
            walletBalance: 60000
        }
    ];

    // Create each customer using findOrCreate to ensure they exist in the database
    for (const customerData of customersData) {
        try {
            const [customer, created] = await User.findOrCreate({
                where: { email: customerData.email }, // Use email as the unique identifier
                defaults: customerData
            });

            if (created) {
                console.log(`✅ Created new customer: ${customer.email}`);
            } else {
                console.log(`ℹ️  Customer already exists: ${customer.email} - using existing`);
            }

            customers.push(customer);
        } catch (error) {
            console.error(`❌ Error creating customer ${customerData.email}:`, error.message);

            // Try to find the existing customer instead
            const existingCustomer = await User.findOne({ where: { email: customerData.email } });
            if (existingCustomer) {
                console.log(`ℹ️  Using existing customer: ${existingCustomer.email}`);
                customers.push(existingCustomer);
            } else {
                throw error; // Re-throw if we can't find the customer either
            }
        }
    }

    return customers;
}

// Helper function to generate booking number
function generateBookingNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `FXF${timestamp}${random}`;
}

async function createBookings(customers, providerId, services) {
    const now = new Date();

    // Use the actual customer objects returned from createCustomers
    const bookingsData = [
        // Completed bookings (older)
        {
            id: generateUUID(),
            bookingNumber: generateBookingNumber(),
            userId: customers[0].id, // Sarah
            providerId,
            serviceId: services[0].id, // Electrical
            scheduledDate: new Date(now.getTime() - (15 * 24 * 60 * 60 * 1000)), // 15 days ago
            scheduledTime: '10:00',
            status: 'completed',
            paymentStatus: 'paid',
            totalAmount: 25000,
            address: {
                street: '23 Admiralty Way',
                city: 'Lagos',
                state: 'Lagos',
                landmark: 'Near the shopping mall'
            },
            specialInstructions: 'Please call before arriving. Gate code is 1234.',
            completedAt: new Date(now.getTime() - (15 * 24 * 60 * 60 * 1000) + (2 * 60 * 60 * 1000)), // 2 hours after scheduled
            createdAt: new Date(now.getTime() - (18 * 24 * 60 * 60 * 1000))
        },
        {
            id: generateUUID(),
            bookingNumber: generateBookingNumber(),
            userId: customers[1].id, // Michael
            providerId,
            serviceId: services[1].id, // Plumbing
            scheduledDate: new Date(now.getTime() - (12 * 24 * 60 * 60 * 1000)), // 12 days ago
            scheduledTime: '14:00',
            status: 'completed',
            paymentStatus: 'paid',
            totalAmount: 20000,
            address: {
                street: '45 Ikoyi Crescent',
                city: 'Lagos',
                state: 'Lagos',
                landmark: 'Blue gate, apartment 4B'
            },
            specialInstructions: 'Bathroom sink leak in the master bathroom.',
            completedAt: new Date(now.getTime() - (12 * 24 * 60 * 60 * 1000) + (1.5 * 60 * 60 * 1000)), // 1.5 hours after scheduled
            createdAt: new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000))
        },
        {
            id: generateUUID(),
            bookingNumber: generateBookingNumber(),
            userId: customers[2].id, // Fatima
            providerId,
            serviceId: services[2].id, // AC Installation
            scheduledDate: new Date(now.getTime() - (8 * 24 * 60 * 60 * 1000)), // 8 days ago
            scheduledTime: '09:00',
            status: 'completed',
            paymentStatus: 'paid',
            totalAmount: 35000,
            address: {
                street: '12 Surulere Road',
                city: 'Lagos',
                state: 'Lagos',
                landmark: 'Yellow building, ground floor'
            },
            specialInstructions: 'Installing new split AC in the living room.',
            completedAt: new Date(now.getTime() - (8 * 24 * 60 * 60 * 1000) + (3 * 60 * 60 * 1000)), // 3 hours after scheduled
            createdAt: new Date(now.getTime() - (10 * 24 * 60 * 60 * 1000))
        },
        {
            id: generateUUID(),
            bookingNumber: generateBookingNumber(),
            userId: customers[3].id, // James
            providerId,
            serviceId: services[3].id, // Home Cleaning
            scheduledDate: new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000)), // 5 days ago
            scheduledTime: '08:00',
            status: 'completed',
            paymentStatus: 'paid',
            totalAmount: 15000,
            address: {
                street: '8 Lekki Phase 1',
                city: 'Lagos',
                state: 'Lagos',
                landmark: 'White duplex with black gate'
            },
            specialInstructions: 'Deep cleaning for the entire house. Focus on kitchen and bathrooms.',
            completedAt: new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000) + (4 * 60 * 60 * 1000)), // 4 hours after scheduled
            createdAt: new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))
        },

        // Recent/Upcoming bookings
        {
            id: generateUUID(),
            bookingNumber: generateBookingNumber(),
            userId: customers[0].id, // Sarah
            providerId,
            serviceId: services[4].id, // Carpentry
            scheduledDate: new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000)), // 2 days from now
            scheduledTime: '10:00',
            status: 'confirmed',
            paymentStatus: 'pending',
            totalAmount: 30000,
            address: {
                street: '23 Admiralty Way',
                city: 'Lagos',
                state: 'Lagos',
                landmark: 'Same address as before'
            },
            specialInstructions: 'Custom kitchen cabinet installation.',
            createdAt: new Date(now.getTime() - (1 * 24 * 60 * 60 * 1000))
        },
        {
            id: generateUUID(),
            bookingNumber: generateBookingNumber(),
            userId: customers[1].id, // Michael
            providerId,
            serviceId: services[0].id, // Electrical
            scheduledDate: new Date(now.getTime() + (5 * 24 * 60 * 60 * 1000)), // 5 days from now
            scheduledTime: '15:00',
            status: 'pending',
            paymentStatus: 'pending',
            totalAmount: 25000,
            address: {
                street: '45 Ikoyi Crescent',
                city: 'Lagos',
                state: 'Lagos',
                landmark: 'Blue gate, apartment 4B'
            },
            specialInstructions: 'Need to install additional power outlets in the living room.',
            createdAt: new Date(now.getTime() - (6 * 60 * 60 * 1000)) // 6 hours ago
        },
        {
            id: generateUUID(),
            bookingNumber: generateBookingNumber(),
            userId: customers[2].id, // Fatima
            providerId,
            serviceId: services[3].id, // Home Cleaning
            scheduledDate: new Date(now.getTime() + (1 * 24 * 60 * 60 * 1000)), // Tomorrow
            scheduledTime: '11:00',
            status: 'pending',
            paymentStatus: 'pending',
            totalAmount: 15000,
            address: {
                street: '12 Surulere Road',
                city: 'Lagos',
                state: 'Lagos',
                landmark: 'Yellow building, ground floor'
            },
            specialInstructions: 'Weekly cleaning service.',
            createdAt: new Date(now.getTime() - (2 * 60 * 60 * 1000)) // 2 hours ago
        }
    ];

    return await Booking.bulkCreate(bookingsData, {
        ignoreDuplicates: true,
        returning: true
    });
}

async function createPayments(bookings) {
    const completedBookings = bookings.filter(b => b.status === 'completed');

    const paymentsData = completedBookings.map((booking, index) => ({
        id: generateUUID(), // Generate proper UUID instead of custom string
        bookingId: booking.id,
        userId: booking.userId, // ✅ Add userId field that's required by your model
        amount: booking.totalAmount,
        currency: 'NGN', // Add currency field if required by your schema
        paymentMethod: 'card', // Add required paymentMethod field
        transactionReference: `TXN_${Date.now()}_${index}`, // Add transaction reference
        status: 'successful', // ✅ Changed from 'completed' to 'successful'
        gatewayResponse: {}, // Add this field as it appears in your table schema
        paidAt: new Date(booking.createdAt.getTime() + (2 * 60 * 60 * 1000)), // Paid 2 hours after creation
        createdAt: booking.createdAt,
        updatedAt: new Date() // Add updatedAt timestamp
    }));

    return await Payment.bulkCreate(paymentsData, {
        ignoreDuplicates: true,
        returning: true
    });
}

async function createReviews(customers, providerId, bookings) {
    const completedBookings = bookings.filter(b => b.status === 'completed');

    const reviewsData = [{
            id: generateUUID(),
            userId: customers[0].id, // Sarah
            providerId,
            bookingId: completedBookings[0].id,
            rating: 5,
            comment: 'Excellent service! David was very professional and completed the electrical work perfectly. The wiring was done neatly and he explained everything clearly. I highly recommend his services and will definitely book again for future electrical needs.',
            createdAt: new Date(new Date(completedBookings[0].scheduledDate).getTime() + (24 * 60 * 60 * 1000))
        },
        {
            id: generateUUID(),
            userId: customers[1].id, // Michael
            providerId,
            bookingId: completedBookings[1].id,
            rating: 5,
            comment: 'Outstanding plumbing service! The leak was fixed quickly and efficiently. David arrived on time, was very courteous, and cleaned up after the work. The price was fair and the quality of work exceeded my expectations.',
            createdAt: new Date(new Date(completedBookings[1].scheduledDate).getTime() + (12 * 60 * 60 * 1000))
        },
        {
            id: generateUUID(),
            userId: customers[2].id, // Fatima
            providerId,
            bookingId: completedBookings[2].id,
            rating: 4,
            comment: 'Great AC installation service. David was knowledgeable and the installation was done professionally. The AC is working perfectly and he provided good maintenance tips. Very satisfied with the service.',
            createdAt: new Date(new Date(completedBookings[2].scheduledDate).getTime() + (6 * 60 * 60 * 1000))
        },
        {
            id: generateUUID(),
            userId: customers[3].id, // James
            providerId,
            bookingId: completedBookings[3].id,
            rating: 5,
            comment: 'Incredible deep cleaning service! My house has never been this clean. David and his team were thorough, professional, and used high-quality cleaning products. Everything sparkles now. Will definitely book monthly cleaning services.',
            createdAt: new Date(new Date(completedBookings[3].scheduledDate).getTime() + (18 * 60 * 60 * 1000))
        }
    ];

    return await Review.bulkCreate(reviewsData, {
        ignoreDuplicates: true,
        returning: true
    });
}

async function createWalletTransactions(userId, payments) {
    const transactionsData = [];

    // Get current user's balance to calculate balance tracking
    const user = await User.findByPk(userId);
    let currentBalance = parseFloat(user.walletBalance || 0);

    // Create credit transactions for each completed payment
    payments.forEach((payment, index) => {
        const balanceBefore = currentBalance;
        currentBalance += parseFloat(payment.amount);
        const balanceAfter = currentBalance;

        transactionsData.push({
            id: generateUUID(), // Use proper UUID
            userId,
            type: 'credit', // ✅ Use 'credit' instead of 'credit'
            amount: payment.amount,
            description: `Payment received for booking #${payment.bookingId.slice(-8)}`,
            reference: `CREDIT_${Date.now()}_${index}`,
            balanceBefore: balanceBefore.toFixed(2),
            balanceAfter: balanceAfter.toFixed(2),
            createdAt: payment.paidAt,
            updatedAt: new Date()
        });
    });

    // Add withdrawal transactions (use 'debit' type instead of 'withdrawal')
    const withdrawalAmount1 = 45000;
    const balanceBefore1 = currentBalance;
    currentBalance -= withdrawalAmount1;
    const balanceAfter1 = currentBalance;

    transactionsData.push({
        id: generateUUID(), // Use proper UUID
        userId,
        type: 'debit', // ✅ Changed from 'withdrawal' to 'debit'
        amount: withdrawalAmount1,
        description: 'Withdrawal to GTBank account ****1234',
        reference: `WITHDRAW_${Date.now()}_GTB`,
        balanceBefore: balanceBefore1.toFixed(2),
        balanceAfter: balanceAfter1.toFixed(2),
        createdAt: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)), // 7 days ago
        updatedAt: new Date()
    });

    const withdrawalAmount2 = 20000;
    const balanceBefore2 = currentBalance;
    currentBalance -= withdrawalAmount2;
    const balanceAfter2 = currentBalance;

    transactionsData.push({
        id: generateUUID(), // Use proper UUID
        userId,
        type: 'debit', // ✅ Changed from 'withdrawal' to 'debit'
        amount: withdrawalAmount2,
        description: 'Withdrawal to GTBank account ****1234',
        reference: `WITHDRAW_${Date.now() + 1000}_GTB`,
        balanceBefore: balanceBefore2.toFixed(2),
        balanceAfter: balanceAfter2.toFixed(2),
        createdAt: new Date(Date.now() - (14 * 24 * 60 * 60 * 1000)), // 14 days ago
        updatedAt: new Date()
    });

    return await WalletTransaction.bulkCreate(transactionsData, {
        ignoreDuplicates: true,
        returning: true
    });
}

async function updateProviderStats(provider, bookings, reviews) {
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ?
        (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2) :
        0;

    await provider.update({
        totalReviews,
        averageRating: parseFloat(averageRating),
        completedJobs: completedBookings.length
    });
}

// Run the setup
if (require.main === module) {
    setupRealProviderData()
        .then(() => {
            console.log('\n✨ Setup completed successfully!');
            console.log('\n🔐 PROVIDER LOGIN:');
            console.log('   URL: http://localhost:3000/auth');
            console.log('   Email: provider.demo@fixify.com');
            console.log('   Password: SecurePass123!');
            console.log('\n📱 TEST CUSTOMER LOGINS:');
            console.log('   sarah.adebayo.test@fixify.com / customer123');
            console.log('   michael.okafor.test@fixify.com / customer123');
            console.log('   fatima.ibrahim.test@fixify.com / customer123');
            console.log('   james.okonkwo.test@fixify.com / customer123');
            console.log('\n🎯 Next Steps:');
            console.log('   1. Start your frontend: npm run dev');
            console.log('   2. Start your backend: npm start');
            console.log('   3. Login as provider to see your dashboard');
            console.log('   4. Login as customers to book services');

            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Setup failed:', error.message);
            process.exit(1);
        });
}

module.exports = setupRealProviderData;