module.exports = (sequelize, DataTypes) => {
    const ServiceCategory = sequelize.define('ServiceCategory', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'service_categories',
        timestamps: true
    });

    ServiceCategory.associate = (models) => {
        ServiceCategory.hasMany(models.Service, { foreignKey: 'categoryId', as: 'services' });
    };

    return ServiceCategory;
};