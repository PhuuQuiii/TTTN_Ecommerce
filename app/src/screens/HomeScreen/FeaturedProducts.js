import React, { useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { getLatestProducts } from "../../../redux/actions/productActions";
import Skeleton from "../../components/shared/Skeleton";
import SingleCard from "../../components/SingleCard";
import Constants from "../../constants/Constants";
import { getPhoneDetails } from "../../utils/common";

const { width } = Dimensions.get('window');

const FeaturedProducts = (props) => {
  const dispatch = useDispatch();

  // Optimized selectors
  const latestProducts = useSelector(
    (state) => state.products.latestProducts?.products || []
  );
  const loading = useSelector((state) => state.products.latestLoading);

  const { type } = props;

  console.log('FeaturedProducts latestProducts:', latestProducts);
  console.log('FeaturedProducts loading:', loading);

  useEffect(() => {
    if (type === "latest") dispatch(getLatestProducts());
  }, [type, dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{props.title}</Text>
        </View>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Khám phá các sản phẩm mới nhất</Text>
        </View>
      </View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={200}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <Skeleton />
        ) : (
          latestProducts?.map((product) => (
            <SingleCard key={product._id} product={product} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  titleContainer: {
    marginBottom: 4,
  },
  title: {
    fontSize: getPhoneDetails().height < 600
      ? Constants.smallScreenHeaderSize
      : Constants.normalScreenHeaderSize,
    fontWeight: "bold",
    color: '#333',
  },
  subtitleContainer: {
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
});

export default FeaturedProducts;
