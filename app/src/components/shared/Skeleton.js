import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Skeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.skeletonItem}>
        <LinearGradient
          colors={["#f2f2f2", "#e6e6e6", "#f2f2f2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </View>
      <View style={[styles.skeletonItem, { width: 260 }]}>
        <LinearGradient
          colors={["#f2f2f2", "#e6e6e6", "#f2f2f2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </View>
      <View style={[styles.skeletonItem, { width: 220 }]}>
        <LinearGradient
          colors={["#f2f2f2", "#e6e6e6", "#f2f2f2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </View>
      <View style={[styles.skeletonItem, { width: 180 }]}>
        <LinearGradient
          colors={["#f2f2f2", "#e6e6e6", "#f2f2f2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </View>
      <View style={[styles.skeletonItem, { width: 140 }]}>
        <LinearGradient
          colors={["#f2f2f2", "#e6e6e6", "#f2f2f2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
  },
  skeletonItem: {
    width: 300,
    height: 20,
    marginVertical: 6,
    borderRadius: 4,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default Skeleton;
