// scripts/seedProviderData.js
// Run this with: node scripts/seedProviderData.js

const { User, Provider, Service, ServiceCategory, Booking, Payment, Review, WalletTransaction } = require('../models');
const bcrypt = require('bcrypt');

async function seedProviderData() {
    try {
        console.log('🌱 Starting provider data seeding...\n');

        // Create service categories first
        console.log('1. Creating service categories...');
        const categories = await ServiceCategory.bulkCreate([{
                id: '550e8400-e29b-41d4-a716-446655440001',
                name: 'Home Cleaning',
                description: 'Professional home cleaning services',
                imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
                isActive: true
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440002',
                name: 'Electrical Services',
                description: 'Electrical repairs and installations',
                imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400',
                isActive: true
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440003',
                name: 'Plumbing',
                description: 'Plumbing repairs and maintenance',
                imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
                isActive: true
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440004',
                name: 'AC Repair',
                description: 'Air conditioning services',
                imageUrl: 'https://images.unsplash.com/photo-1631545877027-ac9c0b2b1221?w=400',
                isActive: true
            }
        ], {
            ignoreDuplicates: true
        });
        console.log('✅ Service categories created');

        // Create provider user
        console.log('\n2. Creating provider user...');
        const hashedPassword = await bcrypt.hash('password123', 10);

        const [providerUser, created] = await User.findOrCreate({
            where: { email: 'provider@test.com' },
            defaults: {
                id: '550e8400-e29b-41d4-a716-446655440010',
                fullName: 'John Smith',
                email: 'provider@test.com',
                phone: '+2348123456789',
                password: hashedPassword,
                isProvider: true,
                isActive: true,
                isVerified: true,
                address: {
                    street: '123 Business Street',
                    city: 'Lagos',
                    state: 'Lagos',
                    country: 'Nigeria'
                },
                profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
            }
        });

        if (created) {
            console.log('✅ Provider user created');
        } else {
            console.log('✅ Provider user already exists');
        }

        // Create provider profile
        console.log('\n3. Creating provider profile...');
        const [provider, providerCreated] = await Provider.findOrCreate({
            where: { userId: providerUser.id },
            defaults: {
                id: '550e8400-e29b-41d4-a716-446655440020',
                userId: providerUser.id,
                businessName: 'Smith Professional Services',
                bio: 'Professional home services provider with over 8 years of experience. Specializing in electrical work, plumbing, and home maintenance. Licensed and insured.',
                skills: ['Electrical Work', 'Plumbing', 'Home Maintenance', 'AC Repair'],
                experience: 8,
                hourlyRate: 5000,
                isVerified: true,
                isAvailable: true,
                averageRating: 4.8,
                totalReviews: 156,
                workingHours: {
                    monday: { start: '08:00', end: '18:00' },
                    tuesday: { start: '08:00', end: '18:00' },
                    wednesday: { start: '08:00', end: '18:00' },
                    thursday: { start: '08:00', end: '18:00' },
                    friday: { start: '08:00', end: '18:00' },
                    saturday: { start: '09:00', end: '16:00' },
                    sunday: { start: '10:00', end: '14:00' }
                },
                serviceRadius: 25
            }
        });

        if (providerCreated) {
            console.log('✅ Provider profile created');
        } else {
            console.log('✅ Provider profile already exists');
        }

        // Create services for the provider
        console.log('\n4. Creating services...');
        const services = await Service.bulkCreate([{
                id: '550e8400-e29b-41d4-a716-446655440030',
                providerId: provider.id,
                categoryId: categories[1].id, // Electrical Services
                name: 'Electrical Wiring & Installation',
                description: 'Complete electrical wiring, outlet installation, and electrical repairs for homes and offices.',
                price: 15000,
                isActive: true,
                imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400'
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440031',
                providerId: provider.id,
                categoryId: categories[2].id, // Plumbing
                name: 'Plumbing Repairs & Maintenance',
                description: 'Professional plumbing services including pipe repairs, leak fixes, and bathroom installations.',
                price: 12000,
                isActive: true,
                imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400'
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440032',
                providerId: provider.id,
                categoryId: categories[3].id, // AC Repair
                name: 'AC Installation & Repair',
                description: 'Air conditioning installation, repair, and maintenance services for all AC types.',
                price: 18000,
                isActive: true,
                imageUrl: 'https://images.unsplash.com/photo-1631545877027-ac9c0b2b1221?w=400'
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440033',
                providerId: provider.id,
                categoryId: categories[0].id, // Home Cleaning
                name: 'Deep Home Cleaning',
                description: 'Comprehensive deep cleaning service for homes including all rooms and appliances.',
                price: 8000,
                isActive: true,
                imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400'
            }
        ], {
            ignoreDuplicates: true
        });
        console.log('✅ Services created');

        // Create customer users for bookings
        console.log('\n5. Creating customer users...');
        const customers = await User.bulkCreate([{
                id: '550e8400-e29b-41d4-a716-446655440040',
                fullName: 'Sarah Johnson',
                email: 'sarah@test.com',
                phone: '+2348987654321',
                password: hashedPassword,
                isProvider: false,
                isActive: true,
                isVerified: true,
                address: {
                    street: '456 Customer Lane',
                    city: 'Lagos',
                    state: 'Lagos',
                    country: 'Nigeria'
                },
                profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c4?w=400'
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440041',
                fullName: 'Michael Brown',
                email: 'michael@test.com',
                phone: '+2348876543210',
                password: hashedPassword,
                isProvider: false,
                isActive: true,
                isVerified: true,
                address: {
                    street: '789 Client Street',
                    city: 'Lagos',
                    state: 'Lagos',
                    country: 'Nigeria'
                },
                profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
            }
        ], {
            ignoreDuplicates: true
        });
        console.log('✅ Customer users created');

        // Create bookings
        console.log('\n6. Creating bookings...');
        const bookings = await Booking.bulkCreate([{
                id: '550e8400-e29b-41d4-a716-446655440050',
                userId: customers[0].id,
                providerId: provider.id,
                serviceId: services[0].id,
                status: 'completed',
                bookingDate: new Date('2024-07-15'),
                totalAmount: 15000,
                address: {
                    street: '456 Customer Lane',
                    city: 'Lagos',
                    state: 'Lagos',
                    landmark: 'Near the big mall'
                },
                specialInstructions: 'Please call before arriving'
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440051',
                userId: customers[1].id,
                providerId: provider.id,
                serviceId: services[1].id,
                status: 'completed',
                bookingDate: new Date('2024-07-20'),
                totalAmount: 12000,
                address: {
                    street: '789 Client Street',
                    city: 'Lagos',
                    state: 'Lagos',
                    landmark: 'Blue gate house'
                }
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440052',
                userId: customers[0].id,
                providerId: provider.id,
                serviceId: services[2].id,
                status: 'pending',
                bookingDate: new Date('2024-08-05'),
                totalAmount: 18000,
                address: {
                    street: '456 Customer Lane',
                    city: 'Lagos',
                    state: 'Lagos',
                    landmark: 'Near the big mall'
                }
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440053',
                userId: customers[1].id,
                providerId: provider.id,
                serviceId: services[0].id,
                status: 'confirmed',
                bookingDate: new Date('2024-08-08'),
                totalAmount: 15000,
                address: {
                    street: '789 Client Street',
                    city: 'Lagos',
                    state: 'Lagos'
                }
            }
        ], {
            ignoreDuplicates: true
        });
        console.log('✅ Bookings created');

        // Create payments for completed bookings
        console.log('\n7. Creating payments...');
        const payments = await Payment.bulkCreate([{
                id: '550e8400-e29b-41d4-a716-446655440060',
                bookingId: bookings[0].id,
                amount: 15000,
                method: 'paystack',
                status: 'completed',
                reference: 'PAY_001_' + Date.now(),
                paystackReference: 'PSK_' + Date.now()
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440061',
                bookingId: bookings[1].id,
                amount: 12000,
                method: 'paystack',
                status: 'completed',
                reference: 'PAY_002_' + Date.now(),
                paystackReference: 'PSK_' + (Date.now() + 1)
            }
        ], {
            ignoreDuplicates: true
        });
        console.log('✅ Payments created');

        // Create reviews
        console.log('\n8. Creating reviews...');
        const reviews = await Review.bulkCreate([{
                id: '550e8400-e29b-41d4-a716-446655440070',
                userId: customers[0].id,
                providerId: provider.id,
                bookingId: bookings[0].id,
                rating: 5,
                comment: 'Excellent work! John was very professional and completed the electrical work perfectly. Highly recommended!'
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440071',
                userId: customers[1].id,
                providerId: provider.id,
                bookingId: bookings[1].id,
                rating: 4,
                comment: 'Good service. The plumbing issue was fixed quickly and efficiently. Will use again.'
            }
        ], {
            ignoreDuplicates: true
        });
        console.log('✅ Reviews created');

        // Create wallet transactions
        console.log('\n9. Creating wallet transactions...');
        const walletTransactions = await WalletTransaction.bulkCreate([{
                id: '550e8400-e29b-41d4-a716-446655440080',
                userId: providerUser.id,
                type: 'credit',
                amount: 15000,
                description: 'Payment for electrical service',
                status: 'completed',
                reference: 'CREDIT_001_' + Date.now()
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440081',
                userId: providerUser.id,
                type: 'credit',
                amount: 12000,
                description: 'Payment for plumbing service',
                status: 'completed',
                reference: 'CREDIT_002_' + Date.now()
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440082',
                userId: providerUser.id,
                type: 'withdrawal',
                amount: 10000,
                description: 'Withdrawal to GTBank',
                status: 'completed',
                reference: 'WITHDRAW_001_' + Date.now()
            }
        ], {
            ignoreDuplicates: true
        });
        console.log('✅ Wallet transactions created');

        console.log('\n🎉 Provider data seeding completed successfully!');
        console.log('\n📋 Test Credentials:');
        console.log('   Email: provider@test.com');
        console.log('   Password: password123');
        console.log('\n📊 Created Data:');
        console.log(`   - Provider: ${provider.businessName}`);
        console.log(`   - Services: ${services.length}`);
        console.log(`   - Bookings: ${bookings.length}`);
        console.log(`   - Reviews: ${reviews.length}`);
        console.log(`   - Payments: ${payments.length}`);
        console.log(`   - Wallet Transactions: ${walletTransactions.length}`);

    } catch (error) {
        console.error('❌ Error seeding provider data:', error);
        throw error;
    }
}

// Run the seeder
if (require.main === module) {
    seedProviderData()
        .then(() => {
            console.log('\n✅ Seeding completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Seeding failed:', error);
            process.exit(1);
        });
}

module.exports = seedProviderData;