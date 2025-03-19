import React, { useEffect, useState } from "react";
import { ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Button, IconButton, Surface, Text, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../../../redux/actions/authActions";

import Logo from "../../components/Logo";
import Constants from "../../constants/Constants";
import { emailValidator, passwordValidator } from "../../utils/common";

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { authLoading, isAuthenticated, error } = useSelector(state => state.authentication);

  const [email, setEmail] = useState({ value: "Tek@gmail.com", error: "" });
  const [password, setPassword] = useState({ value: "helloworld1", error: "" });

  useEffect(() => {
    if (isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  }, [isAuthenticated]);

  const _onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    dispatch(authenticate({
      email: email.value,
      password: password.value
    }));
  };

  return (
    <ImageBackground
      source={require('../../../assets/background_dot.png')}
      style={styles.background}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />

          <View style={styles.header}>
            <Logo />
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue shopping</Text>
          </View>

          <Surface style={styles.card}>
            {error && (
              <Text style={styles.error}>{error}</Text>
            )}

            <TextInput
              label="Email"
              returnKeyType="next"
              value={email.value}
              onChangeText={(text) => setEmail({ value: text, error: "" })}
              error={!!email.error}
              errorText={email.error}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              left={<TextInput.Icon icon="email" />}
              style={styles.input}
              mode="outlined"
              outlineColor="#ddd"
              activeOutlineColor={Constants.tintColor}
            />

            <TextInput
              label="Password"
              returnKeyType="done"
              value={password.value}
              onChangeText={(text) => setPassword({ value: text, error: "" })}
              error={!!password.error}
              errorText={password.error}
              secureTextEntry
              left={<TextInput.Icon icon="lock" />}
              style={styles.input}
              mode="outlined"
              outlineColor="#ddd"
              activeOutlineColor={Constants.tintColor}
            />

            <Button
              mode="text"
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </Button>

            <Button
              mode="contained"
              onPress={_onLoginPressed}
              loading={authLoading}
              disabled={authLoading}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
              icon="login"
            >
              Sign In
            </Button>

            <View style={styles.row}>
              <Text style={styles.label}>Don't have an account? </Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate("Register")}
                labelStyle={styles.link}
              >
                Sign up
              </Button>
            </View>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    marginLeft: -8,
    marginTop: 8,
  },
  header: {
    alignItems: 'center',
    marginVertical: 40,
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
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: Constants.tintColor,
  },
  button: {
    borderRadius: 12,
    elevation: 0,
    marginBottom: 16,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#666',
  },
  link: {
    color: Constants.tintColor,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  }
});

export default LoginScreen;
