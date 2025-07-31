module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
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
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('booking', 'payment', 'review', 'system', 'promotion'),
            defaultValue: 'system'
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        data: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        readAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'notifications',
        timestamps: true
    });

    Notification.associate = (models) => {
        Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return Notification;
};