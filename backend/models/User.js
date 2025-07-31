const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Full name is required' },
                len: { args: [2, 100], msg: 'Name must be between 2 and 100 characters' }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: 'Email already exists' },
            validate: {
                isEmail: { msg: 'Please enter a valid email' }
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: { args: /^(\+234|0)[789]\d{9}$/, msg: 'Please enter a valid Nigerian phone number' }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: { args: [6, 255], msg: 'Password must be at least 6 characters' }
            }
        },
        role: {
            type: DataTypes.ENUM('user', 'provider', 'admin'),
            defaultValue: 'user'
        },
        profileImage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        coordinates: {
            type: DataTypes.JSONB,
            defaultValue: null
        },
        walletBalance: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00
        },
        isEmailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isPhoneVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        emailVerificationToken: DataTypes.STRING,
        phoneVerificationToken: DataTypes.STRING,
        passwordResetToken: DataTypes.STRING,
        passwordResetExpires: DataTypes.DATE,
        lastLoginAt: DataTypes.DATE
    }, {
        tableName: 'users',
        timestamps: true,
        hooks: {
            beforeCreate: async(user) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 12);
                }
            },
            beforeUpdate: async(user) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 12);
                }
            }
        }
    });

    User.prototype.comparePassword = async function(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    };

    User.associate = (models) => {
        User.hasOne(models.Provider, { foreignKey: 'userId', as: 'providerProfile' });
        User.hasMany(models.Booking, { foreignKey: 'userId', as: 'bookings' });
        User.hasMany(models.Review, { foreignKey: 'userId', as: 'reviews' });
        User.hasMany(models.WalletTransaction, { foreignKey: 'userId', as: 'walletTransactions' });
        User.hasMany(models.Notification, { foreignKey: 'userId', as: 'notifications' });
    };

    return User;
};