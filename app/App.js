import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { NavigationContainer } from '@react-navigation/native';
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { Alert, AppRegistry, Platform, StatusBar } from "react-native";
import "react-native-gesture-handler";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { name as appName } from "./app.json";
import store from "./redux";
import Main from "./src";
import { default as Constant } from "./src/constants/Constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    const notificationListenerSubscription =
      Notifications.addNotificationReceivedListener(async (notification) => {
        setNotification(notification);
        console.warn(notification);
        
        // Store the notification
        try {
          const storedNotifications = await AsyncStorage.getItem("notifications");
          const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
          
          const newNotification = {
            id: Date.now(),
            title: notification.request.content.title,
            body: notification.request.content.body,
            time: new Date().toLocaleString(),
            type: notification.request.content.data?.type || "general",
            data: notification.request.content.data
          };
          
          notifications.unshift(newNotification);
          await AsyncStorage.setItem("notifications", JSON.stringify(notifications));
        } catch (error) {
          console.error("Error storing notification:", error);
        }
      });

    // This listener is fired whenever a user taps on or interacts with a notification
    const responseListenerSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    // Subscribe to network state
    const unsubscribeInternet = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });

    return () => {
      if (notificationListenerSubscription) {
        Notifications.removeNotificationSubscription(
          notificationListenerSubscription
        );
      }
      if (responseListenerSubscription) {
        Notifications.removeNotificationSubscription(
          responseListenerSubscription
        );
      }
      unsubscribeInternet();
    };
  }, []);

  return (
    <Provider store={store}>
      <StatusBar
        backgroundColor={Constant.tintColor}
        barStyle="light-content"
      />
      <NavigationContainer>
        <Main />
      </NavigationContainer>
      {/* <View style={{ padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Debug Information:</Text>
        <Text>Expo Push Token: {expoPushToken || 'Not available'}</Text>
        <Text>Project ID: {Constants.expoConfig?.extra?.eas?.projectId || "Not found"}</Text>
        <Text>Device Name: {Constants.deviceName || 'Not available'}</Text>
        <Text>Platform: {Platform.OS}</Text>
        <Text>Is Device: {Constants.isDevice ? 'Yes' : 'No'}</Text>
      </View> */}
    </Provider>
  );
};

async function registerForPushNotificationsAsync() {
  console.log("Starting push notification registration...");
  console.log("Constants.isDevice:", Constants.isDevice);
  console.log("Platform.OS:", Platform.OS);
  console.log("Constants.deviceName:", Constants.deviceName);
  
  let token;
  
  // Check if running on a physical device using multiple methods
  const isPhysicalDevice = 
    Platform.OS === 'android' || 
    Platform.OS === 'ios';
    
  console.log("Is physical device:", isPhysicalDevice);
  
  if (isPhysicalDevice) {
    console.log("Running on physical device");
    try {
      // Request permission using the new method
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log("Existing notification permission status:", existingStatus);
      
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        console.log("Requesting notification permission...");
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log("New notification permission status:", status);
      }
      
      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        Alert.alert(
          "Permission Required",
          "Please enable notifications in your device settings to receive updates."
        );
        return;
      }
      
      console.log("Getting Expo push token...");
      // Get token without projectId for Expo Go
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Expo push token received:", token);
      
      // Save token to AsyncStorage for later use
      await AsyncStorage.setItem("expoPushToken", token);
      console.log("Token saved to AsyncStorage");
      
    } catch (error) {
      console.error("Error during push notification setup:", error);
      Alert.alert(
        "Error",
        "Failed to set up push notifications. Please try again."
      );
    }
  } else {
    console.log("Not running on physical device");
    Alert.alert(
      "Device Required",
      "Push notifications are only available on physical devices."
    );
  }

  if (Platform.OS === "android") {
    console.log("Setting up Android notification channel...");
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

AppRegistry.registerComponent(appName, () => App);

export default App;

// api to hit
// POST -> https://exp.host/--/api/v2/push/send
// {
//   "to": "ExponentPushToken[26dw9GOujlYXeBDYrHb-yM]",
//   "sound": "default",
//   "title": "Original Title",
//   "body": "And here is the body!",
//   "data": { "data": "goes here" }
// }
