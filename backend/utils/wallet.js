const { User, WalletTransaction } = require('../models');
const { sequelize } = require('../models');

const createWalletTransaction = async({ userId, type, amount, description, reference }) => {
    const transaction = await sequelize.transaction();

    try {
        // Get current user with lock to prevent race conditions
        const user = await User.findByPk(userId, {
            lock: transaction.LOCK.UPDATE,
            transaction
        });

        if (!user) {
            throw new Error('User not found');
        }

        const balanceBefore = parseFloat(user.walletBalance);
        let balanceAfter;

        if (type === 'credit') {
            balanceAfter = balanceBefore + parseFloat(amount);
        } else if (type === 'debit') {
            if (balanceBefore < parseFloat(amount)) {
                throw new Error('Insufficient wallet balance');
            }
            balanceAfter = balanceBefore - parseFloat(amount);
        } else {
            throw new Error('Invalid transaction type');
        }

        // Update user balance
        await user.update({ walletBalance: balanceAfter }, { transaction });

        // Create transaction record
        const walletTransaction = await WalletTransaction.create({
            userId,
            type,
            amount: parseFloat(amount),
            description,
            reference,
            balanceBefore,
            balanceAfter
        }, { transaction });

        await transaction.commit();

        return {
            transaction: walletTransaction,
            newBalance: balanceAfter
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getWalletBalance = async(userId) => {
    const user = await User.findByPk(userId, {
        attributes: ['walletBalance']
    });

    return user ? parseFloat(user.walletBalance) : 0;
};

module.exports = {
    createWalletTransaction,
    getWalletBalance
};