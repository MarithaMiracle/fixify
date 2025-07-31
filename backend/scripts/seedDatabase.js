const { sequelize } = require('../models');
const {
    User,
    Provider,
    ServiceCategory,
    Service,
    Booking,
    Payment,
    Review,
    WalletTransaction,
    Notification
} = require('../models');

const seedDatabase = async() => {
    try {
        console.log('🌱 Starting database seeding...');

        // Sync database (create tables)
        await sequelize.sync({ force: true }); // WARNING: This will drop existing tables
        console.log('✅ Database synced');

        // Seed Service Categories
        const categories = await ServiceCategory.bulkCreate([{
                name: 'Home Services',
                slug: 'home-services',
                description: 'Plumbing, electrical, cleaning, and other home maintenance services',
                icon: 'home',
                isActive: true
            },
            {
                name: 'Beauty & Wellness',
                slug: 'beauty-wellness',
                description: 'Makeup, hair styling, massage, and wellness services',
                icon: 'heart',
                isActive: true
            },
            {
                name: 'Tech & Repairs',
                slug: 'tech-repairs',
                description: 'Computer repair, phone fixing, and tech support',
                icon: 'smartphone',
                isActive: true
            },
            {
                name: 'Catering & Events',
                slug: 'catering-events',
                description: 'Catering, event planning, and party services',
                icon: 'calendar',
                isActive: true
            },
            {
                name: 'Fitness & Training',
                slug: 'fitness-training',
                description: 'Personal training, yoga, and fitness coaching',
                icon: 'activity',
                isActive: true
            },
            {
                name: 'Education & Tutoring',
                slug: 'education-tutoring',
                description: 'Academic tutoring, language lessons, and skill training',
                icon: 'book-open',
                isActive: true
            }
        ]);
        console.log('✅ Service categories seeded');

        // Seed Users
        const users = await User.bulkCreate([{
                fullName: 'John Admin',
                email: 'admin@fixify.com',
                phone: '08012345678',
                password: 'admin123',
                role: 'admin',
                isEmailVerified: true,
                isPhoneVerified: true,
                address: {
                    street: '123 Admin Street',
                    city: 'Lagos',
                    state: 'Lagos',
                    country: 'Nigeria'
                },
                walletBalance: 0
            },
            {
                fullName: 'Jane Customer',
                email: 'customer@example.com',
                phone: '08012345679',
                password: 'customer123',
                role: 'user',
                isEmailVerified: true,
                isPhoneVerified: true,
                address: {
                    street: '456 Customer Ave',
                    city: 'Lagos',
                    state: 'Lagos',
                    country: 'Nigeria'
                },
                walletBalance: 25000.00
            },
            {
                fullName: 'Sarah Adebayo',
                email: 'sarah@makeup.com',
                phone: '08012345680',
                password: 'provider123',
                role: 'provider',
                isEmailVerified: true,
                isPhoneVerified: true,
                address: {
                    street: '789 Provider Blvd',
                    city: 'Lagos',
                    state: 'Lagos',
                    country: 'Nigeria'
                },
                walletBalance: 150000.00
            },
            {
                fullName: 'Mike Electrician',
                email: 'mike@electric.com',
                phone: '08012345681',
                password: 'provider123',
                role: 'provider',
                isEmailVerified: true,
                isPhoneVerified: true,
                address: {
                    street: '321 Service Road',
                    city: 'Abuja',
                    state: 'FCT',
                    country: 'Nigeria'
                },
                walletBalance: 85000.00
            },
            {
                fullName: 'Grace Chef',
                email: 'grace@catering.com',
                phone: '08012345682',
                password: 'provider123',
                role: 'provider',
                isEmailVerified: true,
                isPhoneVerified: true,
                address: {
                    street: '654 Kitchen Lane',
                    city: 'Port Harcourt',
                    state: 'Rivers',
                    country: 'Nigeria'
                },
                walletBalance: 120000.00
            }
        ]);
        console.log('✅ Users seeded');

        // Get provider users
        const providerUsers = users.filter(user => user.role === 'provider');

        // Seed Providers
        const providers = await Provider.bulkCreate([{
                userId: providerUsers[0].id, // Sarah
                businessName: 'Sarah\'s Makeup Studio',
                bio: 'Professional makeup artist with 8+ years of experience. Specializing in bridal, editorial, and special occasion makeup. Available across Lagos and surrounding areas.',
                skills: ['Bridal Makeup', 'Editorial Makeup', 'Special Effects', 'Airbrush', 'Traditional Makeup'],
                experience: 8,
                hourlyRate: 15000.00,
                portfolio: [
                    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600',
                    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
                    'https://images.unsplash.com/photo-1594736797933-d0b22d3d6b86?w=600'
                ],
                workingHours: {
                    monday: { start: '09:00', end: '18:00' },
                    tuesday: { start: '09:00', end: '18:00' },
                    wednesday: { start: '09:00', end: '18:00' },
                    thursday: { start: '09:00', end: '18:00' },
                    friday: { start: '09:00', end: '18:00' },
                    saturday: { start: '08:00', end: '20:00' },
                    sunday: { start: '10:00', end: '16:00' }
                },
                serviceRadius: 50,
                averageRating: 4.8,
                totalReviews: 127,
                completedJobs: 89,
                isVerified: true,
                isAvailable: true
            },
            {
                userId: providerUsers[1].id, // Mike
                businessName: 'Mike\'s Electrical Services',
                bio: 'Licensed electrician with 12 years of experience in residential and commercial electrical work. Available for installations, repairs, and emergency services.',
                skills: ['Electrical Installation', 'Wiring', 'Circuit Repair', 'Emergency Services', 'Solar Installation'],
                experience: 12,
                hourlyRate: 8000.00,
                portfolio: [
                    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600',
                    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'
                ],
                workingHours: {
                    monday: { start: '08:00', end: '17:00' },
                    tuesday: { start: '08:00', end: '17:00' },
                    wednesday: { start: '08:00', end: '17:00' },
                    thursday: { start: '08:00', end: '17:00' },
                    friday: { start: '08:00', end: '17:00' },
                    saturday: { start: '09:00', end: '15:00' }
                },
                serviceRadius: 30,
                averageRating: 4.9,
                totalReviews: 203,
                completedJobs: 156,
                isVerified: true,
                isAvailable: true
            },
            {
                userId: providerUsers[2].id, // Grace
                businessName: 'Grace\'s Catering Services',
                bio: 'Professional caterer specializing in Nigerian and continental cuisines. Perfect for weddings, corporate events, and private parties.',
                skills: ['Nigerian Cuisine', 'Continental Food', 'Event Catering', 'Private Chef', 'Menu Planning'],
                experience: 6,
                hourlyRate: 12000.00,
                portfolio: [
                    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
                    'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600'
                ],
                workingHours: {
                    monday: { start: '07:00', end: '19:00' },
                    tuesday: { start: '07:00', end: '19:00' },
                    wednesday: { start: '07:00', end: '19:00' },
                    thursday: { start: '07:00', end: '19:00' },
                    friday: { start: '07:00', end: '19:00' },
                    saturday: { start: '06:00', end: '22:00' },
                    sunday: { start: '08:00', end: '18:00' }
                },
                serviceRadius: 40,
                averageRating: 4.7,
                totalReviews: 98,
                completedJobs: 72,
                isVerified: true,
                isAvailable: true
            }
        ]);
        console.log('✅ Providers seeded');

        // Seed Services
        const services = await Service.bulkCreate([
            // Sarah's Services (Beauty & Wellness)
            {
                providerId: providers[0].id,
                categoryId: categories[1].id, // Beauty & Wellness
                title: 'Bridal Makeup Package',
                description: 'Complete bridal makeup package including trial session, wedding day makeup, and touch-up kit. Includes false lashes and premium products.',
                price: 50000.00,
                duration: 180, // 3 hours
                images: [
                    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600',
                    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600'
                ],
                requirements: ['Clean face', 'Hair styled separately', 'Reference photos'],
                isActive: true
            },
            {
                providerId: providers[0].id,
                categoryId: categories[1].id,
                title: 'Party/Event Makeup',
                description: 'Professional makeup for parties, events, and special occasions. Includes consultation and makeup application.',
                price: 25000.00,
                duration: 90,
                images: ['https://images.unsplash.com/photo-1594736797933-d0b22d3d6b86?w=600'],
                requirements: ['Clean face', 'Reference photos if available'],
                isActive: true
            },
            {
                providerId: providers[0].id,
                categoryId: categories[1].id,
                title: 'Photoshoot Makeup',
                description: 'Professional makeup for photoshoots and editorial work. Includes multiple looks if needed.',
                price: 30000.00,
                duration: 120,
                images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600'],
                requirements: ['Clean face', 'Shoot details', 'Wardrobe colors'],
                isActive: true
            },

            // Mike's Services (Home Services)
            {
                providerId: providers[1].id,
                categoryId: categories[0].id, // Home Services
                title: 'Electrical Installation & Wiring',
                description: 'Complete electrical installation services including new wiring, socket installation, and electrical panel setup.',
                price: 15000.00,
                duration: 240, // 4 hours
                images: [
                    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600',
                    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'
                ],
                requirements: ['Access to electrical panel', 'Clear work area', 'Materials list'],
                isActive: true
            },
            {
                providerId: providers[1].id,
                categoryId: categories[0].id,
                title: 'Electrical Repairs & Troubleshooting',
                description: 'Professional electrical repair services for faulty wiring, broken sockets, and electrical issues.',
                price: 8000.00,
                duration: 120,
                images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
                requirements: ['Problem description', 'Access to affected areas'],
                isActive: true
            },
            {
                providerId: providers[1].id,
                categoryId: categories[0].id,
                title: 'Emergency Electrical Services',
                description: '24/7 emergency electrical services for urgent electrical problems and power outages.',
                price: 12000.00,
                duration: 90,
                images: ['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600'],
                requirements: ['Immediate access', 'Safety clearance'],
                isActive: true
            },

            // Grace's Services (Catering & Events)
            {
                providerId: providers[2].id,
                categoryId: categories[3].id, // Catering & Events
                title: 'Wedding Catering Package',
                description: 'Complete wedding catering service with Nigerian and continental menu options. Includes serving staff and equipment.',
                price: 200000.00,
                duration: 480, // 8 hours
                images: [
                    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
                    'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600'
                ],
                requirements: ['Guest count', 'Venue details', 'Menu preferences', '2 weeks notice'],
                isActive: true
            },
            {
                providerId: providers[2].id,
                categoryId: categories[3].id,
                title: 'Corporate Event Catering',
                description: 'Professional catering for corporate events, meetings, and conferences. Flexible menu options available.',
                price: 80000.00,
                duration: 300,
                images: ['https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600'],
                requirements: ['Attendee count', 'Event type', 'Dietary restrictions'],
                isActive: true
            },
            {
                providerId: providers[2].id,
                categoryId: categories[3].id,
                title: 'Private Chef Service',
                description: 'Personal chef service for intimate dinners and private events. Customized menu based on preferences.',
                price: 45000.00,
                duration: 240,
                images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600'],
                requirements: ['Menu consultation', 'Kitchen access', 'Ingredient preferences'],
                isActive: true
            }
        ]);
        console.log('✅ Services seeded');

        // Seed Sample Bookings
        const bookings = await Booking.bulkCreate([{
                userId: users[1].id, // Jane Customer
                providerId: providers[0].id, // Sarah
                serviceId: services[0].id, // Bridal Makeup
                scheduledDate: '2024-08-15',
                scheduledTime: '10:00',
                address: {
                    street: '123 Wedding Venue',
                    city: 'Lagos',
                    state: 'Lagos',
                    landmark: 'Near City Mall'
                },
                totalAmount: 50000.00,
                status: 'completed',
                paymentStatus: 'paid',
                specialInstructions: 'Please bring extra lashes and waterproof makeup',
                completedAt: new Date('2024-08-15T14:00:00')
            },
            {
                userId: users[1].id,
                providerId: providers[1].id, // Mike
                serviceId: services[3].id, // Electrical Installation
                scheduledDate: '2024-08-20',
                scheduledTime: '09:00',
                address: {
                    street: '456 Customer Ave',
                    city: 'Lagos',
                    state: 'Lagos',
                    landmark: 'Yellow building'
                },
                totalAmount: 15000.00,
                status: 'confirmed',
                paymentStatus: 'paid',
                specialInstructions: 'Need to install 4 new sockets in the living room'
            }
        ]);
        console.log('✅ Bookings seeded');

        // Seed Payments
        const payments = await Payment.bulkCreate([{
                bookingId: bookings[0].id,
                userId: users[1].id,
                amount: 50000.00,
                currency: 'NGN',
                paymentMethod: 'wallet',
                transactionReference: 'FXF_SEED_001',
                status: 'successful',
                paidAt: new Date('2024-08-10T10:00:00')
            },
            {
                bookingId: bookings[1].id,
                userId: users[1].id,
                amount: 15000.00,
                currency: 'NGN',
                paymentMethod: 'paystack',
                transactionReference: 'FXF_SEED_002',
                gatewayReference: 'PAYSTACK_REF_123',
                status: 'successful',
                paidAt: new Date('2024-08-18T15:30:00')
            }
        ]);
        console.log('✅ Payments seeded');

        // Seed Reviews
        const reviews = await Review.bulkCreate([{
            bookingId: bookings[0].id,
            userId: users[1].id,
            providerId: providers[0].id,
            rating: 5,
            comment: 'Sarah did an absolutely amazing job on my wedding makeup! I felt like a princess. She was professional, punctual, and the makeup lasted all day. Highly recommended!',
            images: []
        }]);
        console.log('✅ Reviews seeded');

        // Seed Wallet Transactions
        const walletTransactions = await WalletTransaction.bulkCreate([{
                userId: users[1].id, // Jane
                type: 'credit',
                amount: 100000.00,
                description: 'Initial wallet funding',
                reference: 'INITIAL_CREDIT',
                balanceBefore: 0.00,
                balanceAfter: 100000.00
            },
            {
                userId: users[1].id,
                type: 'debit',
                amount: 50000.00,
                description: 'Payment for booking FXF001',
                reference: bookings[0].id,
                balanceBefore: 100000.00,
                balanceAfter: 50000.00
            },
            {
                userId: users[1].id,
                type: 'credit',
                amount: 75000.00,
                description: 'Wallet top-up via Paystack',
                reference: 'WALLET_TOPUP_001',
                balanceBefore: 50000.00,
                balanceAfter: 125000.00
            }
        ]);
        console.log('✅ Wallet transactions seeded');

        // Seed Notifications
        const notifications = await Notification.bulkCreate([{
                userId: users[1].id,
                title: 'Welcome to Fixify!',
                message: 'Thank you for joining Fixify. Start exploring amazing services near you.',
                type: 'system',
                isRead: true,
                readAt: new Date()
            },
            {
                userId: users[1].id,
                title: 'Booking Confirmed',
                message: 'Your booking for Bridal Makeup Package has been confirmed for August 15th.',
                type: 'booking',
                data: { bookingId: bookings[0].id },
                isRead: true,
                readAt: new Date()
            },
            {
                userId: users[2].id, // Sarah
                title: 'New Booking Request',
                message: 'You have received a new booking request for Bridal Makeup Package.',
                type: 'booking',
                data: { bookingId: bookings[0].id },
                isRead: true,
                readAt: new Date()
            },
            {
                userId: users[2].id,
                title: 'Payment Received',
                message: 'You have received payment of ₦50,000 for completed booking.',
                type: 'payment',
                isRead: false
            }
        ]);
        console.log('✅ Notifications seeded');

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📋 SEEDED DATA SUMMARY:');
        console.log(`👥 Users: ${users.length} (1 Admin, 1 Customer, 3 Providers)`);
        console.log(`🏢 Providers: ${providers.length}`);
        console.log(`📂 Categories: ${categories.length}`);
        console.log(`⚡ Services: ${services.length}`);
        console.log(`📅 Bookings: ${bookings.length}`);
        console.log(`💳 Payments: ${payments.length}`);
        console.log(`⭐ Reviews: ${reviews.length}`);
        console.log(`💰 Wallet Transactions: ${walletTransactions.length}`);
        console.log(`🔔 Notifications: ${notifications.length}`);

        console.log('\n🔐 LOGIN CREDENTIALS:');
        console.log('Admin: admin@fixify.com / admin123');
        console.log('Customer: customer@example.com / customer123');
        console.log('Provider 1: sarah@makeup.com / provider123');
        console.log('Provider 2: mike@electric.com / provider123');
        console.log('Provider 3: grace@catering.com / provider123');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    } finally {
        await sequelize.close();
    }
};

// Run seeding if this file is executed directly
if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log('✅ Seeding process completed');
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Seeding process failed:', error);
            process.exit(1);
        });
}

module.exports = { seedDatabase };