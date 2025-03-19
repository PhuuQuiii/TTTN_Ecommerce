import React, { useEffect, useRef } from "react";
import { ToastAndroid, View } from "react-native";

import { connect } from "react-redux";

const GlobalErrorComponent = ({ globalError }) => {
  const lastErrorRef = useRef(null);
  const timeoutRef = useRef(null);

  const getErrorMessage = (error) => {
    if (Array.isArray(error)) {
      // If error is an array, get the first error message
      return error[0]?.message || error[0]?.toString() || "Đã xảy ra lỗi";
    } else if (error instanceof Error) {
      // If error is an Error object
      return error.message || "Đã xảy ra lỗi";
    } else if (typeof error === 'string') {
      // If error is a string
      return error;
    } else if (error && typeof error === 'object') {
      // If error is an object
      return error.message || error.errorMessage || "Đã xảy ra lỗi";
    }
    return "Đã xảy ra lỗi";
  };

  const openNotification = (alert) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check if this is the same error as last time
    const currentError = JSON.stringify(alert);
    if (currentError === lastErrorRef.current) {
      return; // Skip if it's the same error
    }

    // console.log('Alert received:', alert);
    // console.log('GlobalError state:', globalError);
    
    let message = "Đã xảy ra lỗi";
    
    if (alert?.errorMessage) {
      message = getErrorMessage(alert.errorMessage);
    } else if (alert?.successMessage) {
      message = alert.successMessage;
    }
    
    // console.log('Final message:', message);
    ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.CENTER);

    // Store the current error
    lastErrorRef.current = currentError;

    // Set a timeout to clear the last error after 3 seconds
    timeoutRef.current = setTimeout(() => {
      lastErrorRef.current = null;
    }, 3000);
  };  


  useEffect(() => {
    if (globalError && (globalError.hasError || globalError.hasSuccess)) {
      openNotification(globalError);
    }

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [globalError]);

  return <View></View>;
};

const mapStateToProps = ({ globalError }) => ({
  globalError,
});

export default connect(mapStateToProps)(GlobalErrorComponent);
