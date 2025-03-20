const express = require('express');
const router = express.Router();
const { auth } = require('../controllers/user_auth');
const {
    sendPushNotification,
    getUserNotifications,
    getAdminNotifications,
    markNotificationAsRead
} = require('../controllers/notification');

// Send push notification (protected route)
router.post('/send', auth, sendPushNotification);

// Get user's notifications
router.get('/user', auth, getUserNotifications);

// Get admin's notifications (using auth middleware for now)
router.get('/admin', auth, getAdminNotifications);

// Mark notification as read
router.patch('/:id/read', auth, markNotificationAsRead);

module.exports = router; 