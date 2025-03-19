import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import NotificationScreen from "../../screens/NotificationScreen";
import { headerOptions } from "../../utils/common";

const Stack = createStackNavigator();

const NotificationStack = () => {
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    >
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={headerOptions("Notifications")}/>
    </Stack.Navigator>
  );
};

export default NotificationStack;
