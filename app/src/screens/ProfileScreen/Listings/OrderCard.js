import React from "react";
import { Image, StyleSheet, View } from "react-native";
import {
  Card,
  Paragraph,
  Title
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import {
  TouchableWithoutFeedback
} from "react-native-gesture-handler";

import { getProductDetails } from "../../../../redux/actions/productActions";
import { SERVER_BASE_URL } from "../../../../utils/common";

const OrderCard = (props) => {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.authentication);

  return (
    <TouchableWithoutFeedback>
      <Card
        onPress={() => {
          props.product &&
            dispatch(getProductDetails(props.product.slug, token));
          props.navigation.navigate("Detail");
        }}
        style={{ marginBottom: 5, height: 200 }}
      >
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
                      {" "}
                      vnđ
                      {` ${
                        props.product.price.$numberDecimal ||
                        props.product.price
                      }`}
                    </Paragraph>
                  )}
                  
                </>
              </View>
            </View>
          </Card.Content>
        {/* <Card.Actions
          style={{
            backgroundColor: Constants.cardColor,
            marginTop: 5,
          }}
        >
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
        </Card.Actions> */}
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

export default OrderCard;
