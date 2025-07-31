module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        bookingNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        providerId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'providers',
                key: 'id'
            }
        },
        serviceId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'services',
                key: 'id'
            }
        },
        scheduledDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        scheduledTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        address: {
            type: DataTypes.JSONB,
            allowNull: false
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'),
            defaultValue: 'pending'
        },
        paymentStatus: {
            type: DataTypes.ENUM('pending', 'paid', 'refunded'),
            defaultValue: 'pending'
        },
        specialInstructions: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        cancelledAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        cancellationReason: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'bookings',
        timestamps: true,
        hooks: {
            beforeCreate: (booking) => {
                // Generate booking number
                const date = new Date();
                const timestamp = date.getTime().toString().slice(-6);
                booking.bookingNumber = `FXF${timestamp}`;
            }
        }
    });

    Booking.associate = (models) => {
        Booking.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Booking.belongsTo(models.Provider, { foreignKey: 'providerId', as: 'provider' });
        Booking.belongsTo(models.Service, { foreignKey: 'serviceId', as: 'service' });
        Booking.hasOne(models.Payment, { foreignKey: 'bookingId', as: 'payment' });
        Booking.hasOne(models.Review, { foreignKey: 'bookingId', as: 'review' });
    };

    return Booking;
};