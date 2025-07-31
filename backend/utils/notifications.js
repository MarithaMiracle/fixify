const { Notification } = require('../models');

const sendNotification = async(userId, { title, message, type = 'system', data = {} }) => {
    try {
        const notification = await Notification.create({
            userId,
            title,
            message,
            type,
            data
        });

        // Emit real-time notification if socket.io is available
        if (global.io) {
            global.io.to(`user_${userId}`).emit('new_notification', notification);
        }

        return notification;
    } catch (error) {
        console.error('Failed to send notification:', error);
        throw error;
    }
};

const markNotificationAsRead = async(notificationId, userId) => {
    try {
        const notification = await Notification.findOne({
            where: { id: notificationId, userId }
        });

        if (!notification) {
            throw new Error('Notification not found');
        }

        await notification.update({
            isRead: true,
            readAt: new Date()
        });

        return notification;
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
        throw error;
    }
};

const getUserNotifications = async(userId, { page = 1, limit = 20, unread = false }) => {
    const offset = (page - 1) * limit;
    const whereClause = { userId };

    if (unread) {
        whereClause.isRead = false;
    }

    const notifications = await Notification.findAndCountAll({
        where: whereClause,
        order: [
            ['createdAt', 'DESC']
        ],
        limit: parseInt(limit),
        offset: parseInt(offset)
    });

    return {
        notifications: notifications.rows,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(notifications.count / limit),
            totalItems: notifications.count,
            itemsPerPage: parseInt(limit)
        }
    };
};

module.exports = {
    sendNotification,
    markNotificationAsRead,
    getUserNotifications
};