import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { deauthenticate } from "../../../redux/actions/authActions";
import { getOrders } from "../../../redux/actions/orderActions";
import { getMyReviews } from "../../../redux/actions/userActions";
import { getWishListItems } from "../../../redux/actions/wishlistActions";
import Skeleton from "../../components/shared/Skeleton";
import MyActions from "./MyActions";
import UserInfo from "./UserInfo";

const ProfileScreen = () => {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.authentication);
  const { myReviews } = useSelector((state) => state.user);
  const { wishlistItems } = useSelector((state) => ({
    wishlistItems: state.wishlist.getWishlistItems
  }));
  const { myOrders } = useSelector((state) => ({
    myOrders: state.order.getOrders
  }));

  useEffect(() => {
    dispatch(getMyReviews(`page=1`, token));
    dispatch(getWishListItems(`page=1&perPage=10`, token));
    dispatch(getOrders(`page=1`, token));
  }, []);

  const handleLogout = async () => {
    dispatch(deauthenticate());
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <UserInfo />
        {(!myReviews || !wishlistItems || !myOrders) ? (
          <Skeleton />
        ) : (
          <MyActions 
            myReviews={myReviews} 
            wishlistItems={wishlistItems} 
            myOrders={myOrders}
          />
        )}
        <View style={styles.logoutContainer}>
          <Button 
            mode="contained" 
            onPress={handleLogout}
            style={styles.logoutButton}
            labelStyle={styles.logoutButtonLabel}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  logoutContainer: {
    padding: 16,
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: '#C20A00FF',
    borderRadius: 8,
  },
  logoutButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
