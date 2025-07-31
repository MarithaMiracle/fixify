module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        bookingId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'bookings',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING,
            defaultValue: 'NGN'
        },
        paymentMethod: {
            type: DataTypes.ENUM('card', 'bank_transfer', 'wallet', 'paystack', 'flutterwave'),
            allowNull: false
        },
        paymentGateway: {
            type: DataTypes.STRING,
            allowNull: true
        },
        transactionReference: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        gatewayReference: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('pending', 'processing', 'successful', 'failed', 'cancelled', 'refunded'),
            defaultValue: 'pending'
        },
        gatewayResponse: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        paidAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        refundedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'payments',
        timestamps: true
    });

    Payment.associate = (models) => {
        Payment.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
        Payment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return Payment;
};