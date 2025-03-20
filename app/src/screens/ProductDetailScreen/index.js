import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { View, ScrollView, SafeAreaView } from "react-native";
import { TouchableRipple, Divider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
// import Gallery from "react-native-image-gallery";
import ImageView from "react-native-image-viewing";

import ProductDetailHeader from "./ProductDetailHeader";
import Constants from "../../constants/Constants";

import ProductDetailFooter from "./ProductDetailFooter";
import ProductDescription from "./ProductDescription";
import FeaturedProducts from "../HomeScreen/FeaturedProducts";
import Skeleton from "../../components/shared/Skeleton";
import { SERVER_BASE_URL } from "../../../utils/common";

const ProductDetailScreen = (props) => {
  const { productDetails, productDetailsLoading } = useSelector(
    ({ products }) => products
  );

  const { token } = useSelector(({ authentication }) => authentication);

  const [visible, setVisible] = useState(false);

  const handleGalleryToggle = () => {
    setVisible(!visible);
  };

  const newProps = { ...props, productDetails, loading: productDetailsLoading };

  const galleryImages = productDetails?.product.images.map((prod) => ({
    uri: `${SERVER_BASE_URL}/uploads/${prod.large}`,
  }));

  if (productDetailsLoading) {
    return <Skeleton />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageView
        images={galleryImages}
        imageIndex={0}
        visible={visible}
        onRequestClose={handleGalleryToggle}
        backgroundColor="#696969"
        HeaderComponent={({ imageIndex }) => (
          <View
            style={{
              backgroundColor: "#696969",
              height: 90,
              paddingTop: 20,
              paddingHorizontal: 20,
            }}
          >
            <Ionicons
              name="ios-close-circle"
              size={30}
              color={Constants.tintColor}
              onPress={handleGalleryToggle}
            />
          </View>
        )}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableRipple style={{ height: 250 }} onPress={handleGalleryToggle}>
          <ProductDetailHeader {...newProps} token={token} />
        </TouchableRipple>
        <ProductDescription {...newProps} />
        <View style={{ height: 400, marginTop: 10 }}>
          <FeaturedProducts title={"Similar Products"} />
        </View>
      </ScrollView>
      <ProductDetailFooter {...newProps} />
    </SafeAreaView>
  );
};

export default ProductDetailScreen;
