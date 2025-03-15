import "react-native-gesture-handler";
import "react-native-reanimated";
import { Platform } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { StatusBar, Text, AppRegistry } from "react-native";
import { Provider } from "react-redux";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { name as appName } from "./app.json";
import Main from "./src";

import store from "./redux";
import { default as Constant } from "./src/constants/Constants";

import NetInfo from "@react-native-community/netinfo";

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
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        console.warn(notification);
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
      {/* <Text>Your expo push token: {expoPushToken}</Text> */}
      <Main />
    </Provider>
  );
};

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
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
