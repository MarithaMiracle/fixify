module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        providerId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'providers',
                key: 'id'
            }
        },
        categoryId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'service_categories',
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER, // in minutes
            defaultValue: 60
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        requirements: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'services',
        timestamps: true
    });

    Service.associate = (models) => {
        Service.belongsTo(models.Provider, { foreignKey: 'providerId', as: 'provider' });
        Service.belongsTo(models.ServiceCategory, { foreignKey: 'categoryId', as: 'category' });
        Service.hasMany(models.Booking, { foreignKey: 'serviceId', as: 'bookings' });
    };

    return Service;
};