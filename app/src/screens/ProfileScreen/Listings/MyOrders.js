import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../../../redux/actions/orderActions";
import FlatListScreen from "../../../components/FlatListScreen";
import Constants from "../../../constants/Constants";
import OrderCard from "./OrderCard";

const MyOrders = () => {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.authentication);
  const { myOrders, getOrdersLoading } = useSelector((state) => ({
    myOrders: state.order.getOrders,
    getOrdersLoading: state.order.getOrdersLoading,
  }));

  useEffect(() => {
    dispatch(getOrders(`page=${page}`, token));
  }, [page]);

  const renderItem = ({ item, index }) => (
    <OrderCard product={item.product} item={item} />
  );

  const _handleLoadMore = () => {
    if (!getOrdersLoading && myOrders.totalCount > page * 10) {
      setPage(page + 1);
    }
  };

  const _renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No orders found</Text>
    </View>
  );

  const _renderFooter = () => {
    if (!getOrdersLoading) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={Constants.chosenFilterColor} />
      </View>
    );
  };

  const getItemLayout = (data, index) => ({
    length: 200,
    offset: 200 * index,
    index,
  });

  const keyExtractor = (item, index) => {
    // Create a unique key using order ID, product ID and index
    return `${item._id}-${item.product._id}-${index}`;
  };

  return (
    <FlatListScreen title="My Orders">
      <FlatList
        data={myOrders.orders}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={_handleLoadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        getItemLayout={getItemLayout}
        ListEmptyComponent={_renderEmpty}
        ListFooterComponent={_renderFooter}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
      />
    </FlatListScreen>
  );
};

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Constants.grayColor,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default MyOrders;
