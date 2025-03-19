import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, Surface } from "react-native-paper";
import Constants from "../../constants/Constants";

const MyActions = ({ myReviews, wishlistItems, myOrders }) => {
  const navigation = useNavigation();

  const cards = [
    { 
      id: 1, 
      name: "My Orders", 
      value: myOrders?.totalCount || 0,
      icon: "gift",
      iconType: "Feather",
      route: "My Orders"
    },
    { 
      id: 2, 
      name: "My Reviews", 
      value: myReviews?.totalCount || 0,
      icon: "rate-review",
      iconType: "MaterialIcons",
      route: "My Reviews"
    },
    { 
      id: 3, 
      name: "My Wishlists", 
      value: wishlistItems?.totalCount || 0,
      icon: "bookmark",
      iconType: "Feather",
      route: "My Wishlists"
    },
  ];

  return (
    <Surface style={styles.surface}>
      <Text style={styles.title}>My Activities</Text>
      <View style={styles.cardsContainer}>
        {cards.map((item) => (
          <Card
            style={styles.card}
            key={item.id}
            onPress={() => navigation.navigate(item.route)}
            elevation={2}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardValue}>{item.value}</Text>
                <Text style={styles.cardName}>{item.name}</Text>
              </View>
              <View style={styles.cardIcon}>
                {item.iconType === "Feather" ? (
                  <Feather name={item.icon} size={32} color={Constants.chosenFilterColor} />
                ) : (
                  <MaterialIcons name={item.icon} size={32} color={Constants.chosenFilterColor} />
                )}
              </View>
            </View>
          </Card>
        ))}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  surface: {
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Constants.chosenFilterColor,
  },
  cardsContainer: {
    gap: 12,
  },
  card: {
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Constants.chosenFilterColor,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 14,
    color: '#666',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Constants.chosenFilterColor}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyActions;
