import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Colors,
} from "react-native-paper";
import { View, Image, StyleSheet, Alert, Text } from "react-native";

import {
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

import Constants from "../../constants/Constants";
import { getProductDetails } from "../../../redux/actions/productActions";
import { SERVER_BASE_URL } from "../../../utils/common";
import { removeFromWishList } from "../../../redux/actions/wishlistActions";

const SearchedSingleProduct = (props) => {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.authentication);

  const renderActionButtonComponent = (type, product, item) => {
    switch (type) {
      case "searched":
        return (
          <View style={styles.rowFlex}>
            <Button onPress={() => console.warn("Wifi")} style={{ flex: 0.6 }}>
              <Text style={{ color: "black" }}>{"Add to Wishlist "}</Text>
              <AntDesign
                name="heart"
                size={Constants.normalScreenDescriptionSize}
                color="black"
              />
            </Button>
            <Button style={{ flex: 0.4 }}>
              <Text style={{ color: "black" }}>{"Add to Cart "}</Text>
              <AntDesign
                name="shoppingcart"
                size={Constants.normalScreenDescriptionSize}
                color="black"
              />
            </Button>
          </View>
        );
      case "wishlist":
        return (
          <View style={styles.rowFlex}>
            <Button
              onPress={() => {
                dispatch(removeFromWishList(item._id, product.slug, token));
              }}
              style={{ flex: 1 }}
            >
              <Text style={{ color: "red" }}>{"Remove "}</Text>
              <AntDesign
                name="delete"
                size={Constants.normalScreenDescriptionSize}
                color="red"
              />
            </Button>
            <Button
              onPress={() => props.setVisible(product)}
              style={{ flex: 1 }}
            >
              <Text style={{ color: Constants.tintColor }}>
                {"Add to Cart "}
              </Text>
              <AntDesign
                name="shoppingcart"
                size={Constants.normalScreenDescriptionSize}
                color={Constants.tintColor}
              />
            </Button>
          </View>
        );
      case "myorders":
      case "myreviews":
      case "mywishlists":
        return (
          <View style={styles.rowFlex}>
            <Button
              onPress={() => {
                dispatch(removeFromWishList(item._id, product.slug, token));
              }}
              style={{ flex: 1 }}
            >
              <Text style={{ color: "red" }}>{"Remove "}</Text>
              <AntDesign
                name="delete"
                size={Constants.normalScreenDescriptionSize}
                color="red"
              />
            </Button>
            <Button
              onPress={() => {
                props.product &&
                  dispatch(getProductDetails(props.product.slug, token));
                props.navigation.navigate("Detail");
              }}
              style={{ flex: 1 }}
            >
              <Text style={{ color: Constants.tintColor }}>{"Details "}</Text>
              <AntDesign
                name="eye"
                size={Constants.normalScreenDescriptionSize}
                color={Constants.tintColor}
              />
            </Button>
          </View>
        );
      default:
        <View style={styles.rowFlex}></View>;
    }
  };

  return (
    <TouchableWithoutFeedback>
      <Card
        onPress={() => {
          props.product &&
            dispatch(getProductDetails(props.product.slug, token));
          props.navigation.navigate("Detail");
        }}
        style={{ marginBottom: 5 }}
      >
        <TouchableNativeFeedback>
          <Card.Content>
            <View style={{ flex: 1, flexDirection: "row", marginTop: 5 }}>
              <View style={{ flex: 1.5 }}>
                <Image
                  style={styles.tinyLogo}
                  source={{
                    uri:
                      SERVER_BASE_URL +
                      "/uploads/" +
                      (props.product.image || props.product.images[0].medium),
                  }}
                />
              </View>
              <View style={{ flex: 2 }}>
                <>
                  <Title>{props.product.title || props.product.name}</Title>
                  {props.product.price && (
                    <Paragraph>
                      {` ${
                        props.product.price.$numberDecimal ||
                        props.product.price
                      }`}
                      {" "}
                      đ
                    </Paragraph>
                  )}
                  {props.type !== "myorders" && props.type !== "searched" && (
                    <Avatar.Text
                      size={24}
                      label={
                        (props.item.stars
                          ? Math.ceil(props.item.stars.averageStar)
                          : props.item.star) + "/5 stars"
                      }
                      color={Constants.headerTintColor}
                      backgroundColor="green"
                      width={90}
                      style={{ marginTop: 10 }}
                    />
                  )}
                  {props.type === "searched" && (
                    <Avatar.Text
                      size={24}
                      label={`${props.product.averageRating?.$numberDecimal || 0}/5 stars`}
                      color={Constants.headerTintColor}
                      backgroundColor="green"
                      width={90}
                      style={{ marginTop: 10 }}
                    />
                  )}
                </>
              </View>
            </View>
          </Card.Content>
        </TouchableNativeFeedback>
        <Card.Actions
          style={{
            backgroundColor: Constants.cardColor,
            marginTop: 5,
          }}
        >
          {renderActionButtonComponent(props.type, props.product, props.item)}
        </Card.Actions>
      </Card>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  rowFlex: {
    display: "flex",
    flexDirection: "row",
  },
  tinyLogo: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
});

export default SearchedSingleProduct;
