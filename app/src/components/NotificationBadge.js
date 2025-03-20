import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge, IconButton } from 'react-native-paper';
import { useSelector } from 'react-redux';

const NotificationBadge = ({ onPress }) => {
    const notificationState = useSelector(state => state.notification) || { notifications: [] };
    const notifications = notificationState.notifications || [];
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <View style={styles.container}>
            <IconButton
                icon="bell"
                size={24}
                onPress={onPress}
            />
            {unreadCount > 0 && (
                <Badge
                    size={20}
                    style={styles.badge}
                >
                    {unreadCount}
                </Badge>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
    }
});

export default NotificationBadge; 