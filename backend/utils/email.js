const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });
};

const sendEmail = async({ to, subject, html, text }) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Fixify" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            html,
            text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
};

const sendVerificationEmail = async(email, token, fullName) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #cc6500;">Welcome to Fixify!</h1>
            <p>Hi ${fullName},</p>
            <p>Thank you for registering with Fixify. Please verify your email address to complete your registration.</p>
            <a href="${verificationUrl}" style="background: #cc6500; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
                Verify Email Address
            </a>
            <p>Or copy and paste this link in your browser:</p>
            <p>${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <hr>
            <p style="color: #666; font-size: 14px;">
                If you didn't create an account with Fixify, please ignore this email.
            </p>
        </div>
    `;

    const text = `
        Welcome to Fixify!
        
        Hi ${fullName},
        
        Thank you for registering with Fixify. Please verify your email address by visiting:
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        If you didn't create an account with Fixify, please ignore this email.
    `;

    return await sendEmail({
        to: email,
        subject: 'Verify your Fixify account',
        html,
        text
    });
};

const sendPasswordResetEmail = async(email, token, fullName) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #cc6500;">Password Reset Request</h1>
            <p>Hi ${fullName},</p>
            <p>You requested a password reset for your Fixify account. Click the button below to reset your password:</p>
            <a href="${resetUrl}" style="background: #cc6500; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
                Reset Password
            </a>
            <p>Or copy and paste this link in your browser:</p>
            <p>${resetUrl}</p>
            <p>This link will expire in 10 minutes.</p>
            <hr>
            <p style="color: #666; font-size: 14px;">
                If you didn't request a password reset, please ignore this email.
            </p>
        </div>
    `;

    const text = `
        Password Reset Request
        
        Hi ${fullName},
        
        You requested a password reset for your Fixify account. Visit this link to reset your password:
        ${resetUrl}
        
        This link will expire in 10 minutes.
        
        If you didn't request a password reset, please ignore this email.
    `;

    return await sendEmail({
        to: email,
        subject: 'Reset your Fixify password',
        html,
        text
    });
};

const sendBookingConfirmationEmail = async(email, booking, user) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #cc6500;">Booking Confirmed!</h1>
            <p>Hi ${user.fullName},</p>
            <p>Your booking has been confirmed. Here are the details:</p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3>Booking Details</h3>
                <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
                <p><strong>Service:</strong> ${booking.service.title}</p>
                <p><strong>Date:</strong> ${booking.scheduledDate}</p>
                <p><strong>Time:</strong> ${booking.scheduledTime}</p>
                <p><strong>Total Amount:</strong> ₦${parseFloat(booking.totalAmount).toLocaleString()}</p>
            </div>
            
            <p>We'll send you updates about your booking status.</p>
            <p>Thank you for choosing Fixify!</p>
        </div>
    `;

    return await sendEmail({
        to: email,
        subject: `Booking Confirmed - ${booking.bookingNumber}`,
        html
    });
};

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendBookingConfirmationEmail
};