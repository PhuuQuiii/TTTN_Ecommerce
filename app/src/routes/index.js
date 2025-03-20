import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import React from "react";

const Stack = createStackNavigator();

import CartStackScreen from "../screens/CartStackScreen";
import CheckOut from "../screens/CheckOut";
import NotificationScreen from "../screens/NotificationScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import ProductListScreen from "../screens/ProductListScreen/ProductListScreen";
import EditProfile from "../screens/ProfileScreen/EditProfile";
import MyOrders from "../screens/ProfileScreen/Listings/MyOrders";
import MyReviews from "../screens/ProfileScreen/Listings/MyReviews";
import MyWishlists from "../screens/ProfileScreen/Listings/MyWishlists";
import SearchScreen from "../screens/SearchScreen";
import WishListScreen from "../screens/WishList";
import DrawerNavigators from "./DrawerNavigators";
import { AuthStack } from "./StackNavigators";
import QnAStack from "./StackNavigators/QnAStack";

export default function App(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="Main">
        {(prop) => <DrawerNavigators {...prop} customCategories={props} />}
      </Stack.Screen>
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Products" component={ProductListScreen} />
      <Stack.Screen name="WishList" component={WishListScreen} />
      <Stack.Screen name="CartStack" component={CartStackScreen} />
      <Stack.Screen name="Detail" component={ProductDetailScreen} />
      <Stack.Screen name="QnA" component={QnAStack} />
      <Stack.Screen name="CheckOut" component={CheckOut} />
      <Stack.Screen name="My Orders" component={MyOrders} />
      <Stack.Screen name="My Reviews" component={MyReviews} />
      <Stack.Screen name="My Wishlists" component={MyWishlists} />
      <Stack.Screen name="Edit Profile" component={EditProfile} />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationScreen}
        options={{
          title: 'Thông báo',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
        }}
      />
    </Stack.Navigator>
  );
}
