const Notification = require("../models/Notification");
const User = require("../models/User");
const Admin = require("../models/Admin");
const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
let expo = new Expo();

exports.sendPushNotification = async (req, res) => {
    try {
        const { userId, adminId, title, body, data, type } = req.body;
        
        let recipient;
        let notificationData = {
            title,
            body,
            data: data || {},
            type,
            status: 'pending'
        };

        // Determine if notification is for user or admin
        if (userId) {
            recipient = await User.findById(userId);
            if (!recipient || !recipient.expoPushToken) {
                return res.status(404).json({ error: "User not found or no push token available" });
            }
            notificationData.user = userId;
        } else if (adminId) {
            recipient = await Admin.findById(adminId);
            if (!recipient) {
                return res.status(404).json({ error: "Admin not found" });
            }
            notificationData.admin = adminId;
        } else {
            return res.status(400).json({ error: "Either userId or adminId is required" });
        }

        // Create notification message for push notification
        const message = {
            to: recipient.expoPushToken,
            sound: 'default',
            title: title,
            body: body,
            data: data || {},
            priority: 'high'
        };

        // Validate the token
        if (!Expo.isExpoPushToken(message.to)) {
            return res.status(400).json({ error: "Invalid Expo push token" });
        }

        // Send the notification
        const chunks = expo.chunkPushNotifications([message]);
        const tickets = [];

        for (let chunk of chunks) {
            try {
                const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error('Error sending notification:', error);
                return res.status(500).json({ error: "Error sending notification" });
            }
        }

        // Save notification to database
        const notification = new Notification(notificationData);
        await notification.save();

        res.json({ 
            success: true, 
            message: "Notification sent successfully",
            tickets: tickets 
        });

    } catch (error) {
        console.error('Error in sendPushNotification:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: "Error fetching notifications" });
    }
};

exports.getAdminNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ admin: req.admin._id })
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: "Error fetching notifications" });
    }
};

exports.markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: "Error updating notification" });
    }
};

// Helper function to create admin notification
exports.createAdminNotification = async (adminId, notificationObj) => {
    try {
        let notification = await Notification.findOne({ admin: adminId });
        
        if (!notification) {
            notification = new Notification({
                admin: adminId,
                notifications: [notificationObj],
                noOfUnseen: 1
            });
        } else {
            notification.notifications.unshift(notificationObj);
            notification.noOfUnseen += 1;
            
            // Keep only last 20 notifications
            if (notification.notifications.length > 20) {
                notification.notifications = notification.notifications.slice(0, 20);
            }
        }
        
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating admin notification:', error);
        throw error;
    }
}; 