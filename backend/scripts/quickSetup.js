#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Fixify Backend Quick Setup');
console.log('=============================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env file...');

    const envTemplate = `NODE_ENV=development
PORT=5000

# PostgreSQL Database (Local Development)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fixify_dev
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=${generateSecretKey()}
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Storage
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password

# Payment Gateway (Test Keys)
PAYSTACK_SECRET_KEY=sk_test_your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=pk_test_your-paystack-public-key
PAYSTACK_WEBHOOK_SECRET=your-webhook-secret

# For production deployment, add:
# DATABASE_URL=postgresql://user:password@host:port/database
`;

    fs.writeFileSync(envPath, envTemplate);
    console.log('✅ .env file created');
} else {
    console.log('✅ .env file already exists');
}

// Create uploads directory
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    ['profiles', 'services', 'portfolio', 'verification', 'general'].forEach(dir => {
        fs.mkdirSync(path.join(uploadsDir, dir), { recursive: true });
    });
    console.log('✅ Upload directories created');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
    execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('✅ Dependencies installed');
} catch (error) {
    console.log('❌ Failed to install dependencies. Run: npm install');
}

console.log('\n🎯 NEXT STEPS:');
console.log('1. Install PostgreSQL locally or set up a free database:');
console.log('   - Local: https://postgresql.org/download/');
console.log('   - Free: Railway.app, Supabase.com, or Neon.tech');
console.log('');
console.log('2. Update your .env file with correct database credentials');
console.log('');
console.log('3. Create the database:');
console.log('   createdb fixify_dev');
console.log('');
console.log('4. Seed the database with sample data:');
console.log('   npm run seed');
console.log('');
console.log('5. Start the development server:');
console.log('   npm run dev');
console.log('');
console.log('6. Test the API:');
console.log('   http://localhost:5000/api/health');
console.log('');
console.log('🔐 Default login credentials will be displayed after seeding!');

function generateSecretKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 64; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}