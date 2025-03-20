import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { useDispatch } from "react-redux";
import { getProductsByCategory, searchFilter } from "../../redux/actions/searchActions";
import CustomDrawer from "../components/CustomDrawerComponent";
import TabNavigators from "./TabNavigators";

const Drawer = createDrawerNavigator();

const DrawerNavigators = (props) => {
  const dispatch = useDispatch()
  const setDataToGetProductsByCategory = ({_id, slug}) => {
    dispatch(getProductsByCategory({_id, slug}))
    dispatch(searchFilter({cat_id: _id, cat_slug: slug}));
    props.navigation.navigate("Products")
  }

  return (
    <Drawer.Navigator
      drawerType="slide"
      initialRouteName="Tab"
      drawerContent={(prop) => CustomDrawer({ ...prop, ...props, setDataToGetProductsByCategory })}
    >
      <Drawer.Screen name="Tab" component={TabNavigators} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigators;
