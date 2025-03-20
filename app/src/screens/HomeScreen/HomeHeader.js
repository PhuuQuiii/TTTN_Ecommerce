import React from "react";
import { Appbar } from "react-native-paper";
import Constants from "../../constants/Constants";

const HomeHeader = ({ navigation }) => {
  return (
    <Appbar.Header statusBarHeight={0} style={{ elevation: 0 }}>
      <Appbar.Action
        icon="menu"
        color={Constants.headerTintColor}
        onPress={() => navigation.openDrawer()}
      />
      <Appbar.Content color={Constants.headerTintColor} title="KINDEEM" />
      <Appbar.Action
        color={Constants.headerTintColor}
        icon="heart"
        onPress={() => navigation.navigate("WishList")}
      />
    </Appbar.Header>
  );
};

export default HomeHeader;
