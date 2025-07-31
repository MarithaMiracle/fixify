module.exports = (sequelize, DataTypes) => {
    const WalletTransaction = sequelize.define('WalletTransaction', {
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
        type: {
            type: DataTypes.ENUM('credit', 'debit'),
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reference: {
            type: DataTypes.STRING,
            allowNull: true
        },
        balanceBefore: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        balanceAfter: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        tableName: 'wallet_transactions',
        timestamps: true
    });

    WalletTransaction.associate = (models) => {
        WalletTransaction.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return WalletTransaction;
};