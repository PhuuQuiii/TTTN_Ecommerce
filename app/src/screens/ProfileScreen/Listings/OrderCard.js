import { useNavigation } from '@react-navigation/native';
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import {
  Button,
  Divider,
  Surface,
  Text
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { getProductDetails } from "../../../../redux/actions/productActions";
import { SERVER_BASE_URL } from "../../../../utils/common";
import Constants from "../../../constants/Constants";

const OrderCard = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { token } = useSelector((state) => state.authentication);

  const handlePress = () => {
    if (props.product) {
      dispatch(getProductDetails(props.product.slug, token));
      navigation.navigate("Detail");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    if (!status || typeof status !== 'string') return '#757575';
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return '#FFA500';
      case 'processing':
        return '#2196F3';
      case 'shipped':
        return '#4CAF50';
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getProductImage = () => {
    if (!props.product) return null;
    const imageUrl = props.product.image || (props.product.images && props.product.images[0]?.medium);
    return imageUrl ? SERVER_BASE_URL + "/uploads/" + imageUrl : null;
  };

  const getProductPrice = () => {
    if (!props.product?.price) return 0;
    return props.product.price.$numberDecimal || props.product.price;
  };

  const getTotalAmount = () => {
    const price = getProductPrice();
    const quantity = props.item?.quantity || 1;
    return price * quantity;
  };

  const getOrderStatus = () => {
    if (!props.item?.status) return 'Unknown';
    if (typeof props.item.status === 'string') return props.item.status;
    if (props.item.status.currentStatus) return props.item.status.currentStatus;
    return 'Unknown';
  };

  if (!props.item || !props.product) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Surface style={styles.card}>
        <View style={styles.header}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>
              Order #{props.item._id ? props.item._id.slice(-6) : 'N/A'}
            </Text>
            <Text style={styles.orderDate}>
              {formatDate(props.item.createdAt)}
            </Text>
          </View>
          <View style={[styles.statusContainer, { backgroundColor: getStatusColor(getOrderStatus()) }]}>
            <Text style={styles.statusText}>
              {getOrderStatus()}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.productContainer}>
          <Image
            style={styles.productImage}
            source={{ uri: getProductImage() }}
            defaultSource={require('../../../../assets/background_dot.png')}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {props.product.title || props.product.name || 'Unknown Product'}
            </Text>
            <Text style={styles.shopName}>
              {props.product.shop?.name || 'Unknown Shop'}
            </Text>
            <View style={styles.priceContainer}>
              <Text style={styles.quantity}>
                x{props.item.quantity || 1}
              </Text>
              <Text style={styles.price}>
                {getProductPrice()} đ
              </Text>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>
              {getTotalAmount()} đ
            </Text>
          </View>
          <Button
            mode="contained"
            onPress={handlePress}
            style={styles.detailsButton}
            labelStyle={styles.buttonLabel}
          >
            View Details
          </Button>
        </View>
      </Surface>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    padding: 12,
    elevation: 2,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Constants.tintColor,
  },
  orderDate: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 8,
  },
  productContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 12,
    color: '#757575',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Constants.tintColor,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: '#757575',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Constants.tintColor,
  },
  detailsButton: {
    marginLeft: 12,
    backgroundColor: Constants.tintColor,
  },
  buttonLabel: {
    fontSize: 12,
  },
});

export default React.memo(OrderCard);
