import React, { memo } from "react";
import { Image, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window"); // Lấy chiều rộng màn hình

const Logo = () => (
  <Image source={require("../../assets/logo.png")} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: width, // Chiều rộng bằng 100% màn hình
    height: 128,
    marginBottom: 12,
    resizeMode: "contain", // Giữ tỷ lệ ảnh, tránh bị méo
  },
});

export default memo(Logo);
