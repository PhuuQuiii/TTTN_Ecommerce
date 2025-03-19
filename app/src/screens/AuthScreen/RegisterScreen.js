import React, { memo, useEffect, useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, IconButton, Snackbar, Surface, Text, TextInput } from "react-native-paper";
import { useDispatch } from 'react-redux';
import { register } from '../../../redux/actions/authActions';

import Logo from '../../components/Logo';
import Constants from '../../constants/Constants';
import { emailValidator, nameValidator, passwordValidator } from '../../utils/common';
// import {
//   emailValidator,
//   passwordValidator,
//   nameValidator,
// } from '../core/utils';

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('error'); // 'error' or 'success'

  useEffect(() => {
    if (success) {
      setSnackbarMessage('Registration successful! Please check your email to verify your account.');
      setSnackbarType('success');
      setSnackbarVisible(true);
      // Navigate after showing success message
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }, 2000);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  }, [error]);

  const _onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await dispatch(register({
        name: name.value,
        email: email.value,
        password: password.value
      }));
      
      if (response && response.isSuccess) {
        setSuccess(true);
      } else {
        setError(response?.errorMessage || 'Registration failed');
      }
    } catch (error) {
      // console.error('Registration error:', error);
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us to start shopping</Text>
          </View>

          <Surface style={styles.card}>
            <TextInput
              label="Name"
              returnKeyType="next"
              value={name.value}
              onChangeText={text => setName({ value: text, error: '' })}
              error={!!name.error}
              errorText={name.error}
              left={<TextInput.Icon icon="account" />}
              style={styles.input}
              mode="outlined"
              outlineColor="#ddd"
              activeOutlineColor={Constants.tintColor}
            />

            <TextInput
              label="Email"
              returnKeyType="next"
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

            <TextInput
              label="Password"
              returnKeyType="done"
              value={password.value}
              onChangeText={text => setPassword({ value: text, error: '' })}
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
              mode="contained"
              onPress={_onSignUpPressed}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
              icon="account-plus"
              loading={loading}
              disabled={loading}
            >
              Create Account
            </Button>

            <View style={styles.row}>
              <Text style={styles.label}>Already have an account? </Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Login')}
                labelStyle={styles.link}
              >
                Sign In
              </Button>
            </View>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={[
          styles.snackbar,
          snackbarType === 'success' ? styles.successSnackbar : styles.errorSnackbar
        ]}
      >
        {snackbarMessage}
      </Snackbar>
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
  snackbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  successSnackbar: {
    backgroundColor: '#4CAF50',
  },
  errorSnackbar: {
    backgroundColor: '#F44336',
  },
});

export default memo(RegisterScreen);
