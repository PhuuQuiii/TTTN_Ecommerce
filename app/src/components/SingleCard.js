import React from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { getProductDetails } from "../../redux/actions/productActions";
import { SERVER_BASE_URL } from "../../utils/common";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.45;
const cardHeight = cardWidth * 1.5;

const SingleCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { token } = useSelector(state => state.authentication); // Lấy token nếu cần

  const onPress = () => {
    dispatch(getProductDetails(product.slug, token));
    navigation.navigate("Detail", { slug: product.slug }); // Điều hướng đến trang chi tiết
  };

  const formatPrice = (price) => {
    if (!price) return "0đ";
    const numericPrice = price.$numberDecimal ? parseFloat(price.$numberDecimal) : price;
    return `${numericPrice.toLocaleString("vi-VN")}đ`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: SERVER_BASE_URL + "/uploads/" + product.images[0].medium }}
          style={styles.image}
        />
        {product.discountRate > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{product.discountRate}%</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category?.length > 0 ? product.category[0]?.displayName || "Không có danh mục" : "Không có danh mục"}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name || "Không có tên sản phẩm"}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          {product.discountRate > 0 && (
            <Text style={styles.originalPrice}>
              {formatPrice(product.price.$numberDecimal * (1 + product.discountRate / 100))}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: cardHeight,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
    elevation: 5,
  },
  imageContainer: {
    width: "100%",
    height: cardWidth,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#e91e63",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 12,
  },
  category: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginVertical: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e91e63",
  },
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },
});

export default SingleCard;
