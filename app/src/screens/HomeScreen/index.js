import React from "react";
import { Image, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import FeaturedProducts from "./FeaturedProducts";
import HomeHeader from "./HomeHeader";
import MainCarousel from "./MainCarousel";
import SearchView from "./SearchView";

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const HomeScreen = (props) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      stickyHeaderIndices={[1]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.headerContainer}>
        <HomeHeader headerTitle="" {...props} />
      </View>
      <View style={styles.searchContainer}>
        <SearchView {...props} />
      </View>
      <View style={styles.mainContent}>
        <View style={styles.carouselContainer}>
          <MainCarousel />
        </View>
        <View style={styles.productsSection}>
          <FeaturedProducts title="Sản phẩm mới nhất" type="latest" />
        </View>
        <View style={styles.adContainer}>
          <Image
            source={require("../../../assets/ad.jpg")}
            style={styles.adImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.productsSection}>
          <FeaturedProducts title="Sản phẩm nổi bật" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    height: 0,
  },
  searchContainer: {
    height: 60,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainContent: {
    paddingVertical: 16,
  },
  carouselContainer: {
    height: 200,
    marginBottom: 24,
  },
  productsSection: {
    marginBottom: 24,
  },
  adContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  adImage: {
    width: '100%',
    height: '100%',
  },
});

// function mapStateToProps(state) {
//   return {
//     Journey: state.Journey.journey_store,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({ jorneyAction }, dispatch);
// }

// export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
export default HomeScreen;
