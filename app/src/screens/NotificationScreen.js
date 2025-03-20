import { format } from 'date-fns';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Divider, List, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, markAsRead } from '../redux/actions/notificationActions';

const NotificationScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const notificationState = useSelector(state => state.notification) || { notifications: [], loading: false };
    const { notifications, loading } = notificationState;

    useEffect(() => {
        dispatch(getNotifications());
    }, [dispatch]);

    const handleNotificationPress = async (notification) => {
        if (!notification.isRead) {
            await dispatch(markAsRead(notification._id));
        }
        // Handle navigation based on notification type
        if (notification.type === 'order') {
            navigation.navigate('OrderDetail', { orderId: notification.data.orderId });
        }
    };

    const renderNotification = ({ item }) => (
        <List.Item
            title={item.title}
            description={item.body}
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => (
                <Text {...props} style={styles.time}>
                    {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
                </Text>
            )}
            onPress={() => handleNotificationPress(item)}
            style={[
                styles.notificationItem,
                !item.isRead && styles.unreadNotification
            ]}
        />
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={item => item._id}
                ItemSeparatorComponent={() => <Divider />}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text>Không có thông báo nào</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationItem: {
        paddingVertical: 8,
    },
    unreadNotification: {
        backgroundColor: '#f0f9ff',
    },
    time: {
        fontSize: 12,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});

export default NotificationScreen;
