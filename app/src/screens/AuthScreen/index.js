import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import React, { memo } from "react";
import { Dimensions, ImageBackground, StyleSheet, View } from "react-native";
import { Button, Surface, Text } from "react-native-paper";

import Logo from "../../components/Logo";
import Constants from "../../constants/Constants";
import ForgotPasswordScreen from "./ForgotPasswordScreen";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

const { width } = Dimensions.get('window');
const Stack = createStackNavigator();

const AuthRender = ({ navigation }) => (
  <ImageBackground
    source={require('../../../assets/background_dot.png')}
    style={styles.background}
  >
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo />
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue shopping</Text>
      </View>

      <Surface style={styles.card}>
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="shopping" size={32} color={Constants.tintColor} />
            <Text style={styles.featureText}>Shop with ease</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="heart" size={32} color={Constants.tintColor} />
            <Text style={styles.featureText}>Save favorites</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="truck" size={32} color={Constants.tintColor} />
            <Text style={styles.featureText}>Track orders</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Login")}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
            icon="login"
          >
            Sign In
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate("Register")}
            style={[styles.button, styles.outlinedButton]}
            labelStyle={[styles.buttonLabel, styles.outlinedButtonLabel]}
            contentStyle={styles.buttonContent}
            icon="account-plus"
          >
            Create Account
          </Button>
        </View>
      </Surface>
    </View>
  </ImageBackground>
);

const AuthScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="Auth" component={AuthRender} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Constants.tintColor,
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 12,
    elevation: 0,
  },
  outlinedButton: {
    borderColor: Constants.tintColor,
  },
  outlinedButtonLabel: {
    color: Constants.tintColor,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default memo(AuthScreen);
