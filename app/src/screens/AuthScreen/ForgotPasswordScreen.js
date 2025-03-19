import React, { memo, useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, IconButton, Surface, Text, TextInput } from "react-native-paper";
// import { emailValidator } from '../core/utils';
import Logo from '../../components/Logo';
import Constants from '../../constants/Constants';
// import { theme } from '../core/theme';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: '', error: '' });

  const _onSendPressed = () => {
    // const emailError = emailValidator(email.value);

    // if (emailError) {
    //   setEmail({ ...email, error: emailError });
    //   return;
    // }

    navigation.navigate('LoginScreen');
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
            onPress={() => navigation.navigate('Login')}
            style={styles.backButton}
          />

          <View style={styles.header}>
            <Logo />
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter your email to receive instructions</Text>
          </View>

          <Surface style={styles.card}>
            <TextInput
              label="Email"
              returnKeyType="done"
              value={email.value}
              onChangeText={text => setEmail({ value: text, error: '' })}
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

            <Button
              mode="contained"
              onPress={_onSendPressed}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
              icon="email-send"
            >
              Send Reset Instructions
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.backButton}
              labelStyle={styles.backButtonLabel}
              icon="arrow-left"
            >
              Back to Login
            </Button>
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
  backButtonLabel: {
    color: Constants.tintColor,
  },
});

export default memo(ForgotPasswordScreen);
