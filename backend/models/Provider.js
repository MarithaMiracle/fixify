module.exports = (sequelize, DataTypes) => {
    const Provider = sequelize.define('Provider', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        businessName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        skills: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        experience: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        hourlyRate: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        portfolio: {
            type: DataTypes.JSONB,
            defaultValue: []
        },
        workingHours: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        serviceRadius: {
            type: DataTypes.INTEGER,
            defaultValue: 10 // kilometers
        },
        averageRating: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: 0.00
        },
        totalReviews: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        completedJobs: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        verificationDocuments: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        bankDetails: {
            type: DataTypes.JSONB,
            defaultValue: {}
        }
    }, {
        tableName: 'providers',
        timestamps: true
    });

    Provider.associate = (models) => {
        Provider.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Provider.hasMany(models.Service, { foreignKey: 'providerId', as: 'services' });
        Provider.hasMany(models.Booking, { foreignKey: 'providerId', as: 'bookings' });
        Provider.hasMany(models.Review, { foreignKey: 'providerId', as: 'reviews' });
    };

    return Provider;
};