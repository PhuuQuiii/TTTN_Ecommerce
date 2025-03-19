import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import Moment from "moment";
import React, { useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar, Button, Portal, Snackbar, Surface, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../../redux/actions/userActions";
import { SERVER_BASE_URL } from "../../../utils/common";
import Skeleton from "../../components/shared/Skeleton";
import Constants from "../../constants/Constants";

const UserInfo = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userProfile, loading } = useSelector((state) => state.user);
  const { myReviews, wishlistItems, myOrders } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  React.useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        dob: userProfile.dob || "",
        gender: userProfile.gender || "",
      });
    }
  }, [userProfile]);

  const handleSubmit = async () => {
    try {
      // Format the data before sending
      const formattedData = {
        ...formData,
        gender: formData.gender?.toLowerCase() || 'male'
      };

      await dispatch(updateProfile(formattedData, userProfile._id));
      setSnackbarMessage("Profile updated successfully!");
      setSnackbarType("success");
      setIsEditing(false);
    } catch (error) {
      setSnackbarMessage(error.message || "Failed to update profile");
      setSnackbarType("error");
    } finally {
      setSnackbarVisible(true);
    }
  };

  if (!userProfile) {
    return <Skeleton />;
  }

  const profileImage = userProfile.photo 
    ? `${SERVER_BASE_URL}/uploads/${userProfile.photo}`
    : "https://via.placeholder.com/150";

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }}
        style={styles.headerBackground}
      >
        <View style={styles.headerOverlay}>
          <Avatar.Image
            size={100}
            source={{ uri: profileImage }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{userProfile.name}</Text>
          <Text style={styles.email}>{userProfile.email}</Text>
        </View>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <Surface style={styles.surface}>
          {isEditing ? (
            <>
              <Text style={styles.title}>Edit Profile</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="account" size={24} color={Constants.chosenFilterColor} style={styles.inputIcon} />
                  <TextInput
                    label="Name"
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    style={styles.input}
                    mode="outlined"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="email" size={24} color={Constants.chosenFilterColor} style={styles.inputIcon} />
                  <TextInput
                    label="Email"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="calendar" size={24} color={Constants.chosenFilterColor} style={styles.inputIcon} />
                  <TextInput
                    label="Date of Birth"
                    value={formData.dob}
                    onChangeText={(text) => setFormData({ ...formData, dob: text })}
                    style={styles.input}
                    mode="outlined"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="gender-male-female" size={24} color={Constants.chosenFilterColor} style={styles.inputIcon} />
                  <TextInput
                    label="Gender"
                    value={formData.gender}
                    onChangeText={(text) => setFormData({ ...formData, gender: text })}
                    style={styles.input}
                    mode="outlined"
                  />
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={loading}
                  style={styles.submitButton}
                  icon="content-save"
                >
                  Save Changes
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => setIsEditing(false)}
                  style={styles.cancelButton}
                  icon="close"
                >
                  Cancel
                </Button>
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="calendar" size={24} color={Constants.chosenFilterColor} />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Date of Birth</Text>
                  <Text style={styles.infoValue}>{userProfile.dob}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="gender-male-female" size={24} color={Constants.chosenFilterColor} />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Gender</Text>
                  <Text style={styles.infoValue}>{userProfile.gender}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="clock-outline" size={24} color={Constants.chosenFilterColor} />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Member Since</Text>
                  <Text style={styles.infoValue}>
                    {Moment(userProfile.createdAt).startOf("hour").fromNow()}
                  </Text>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                  icon="account-edit"
                >
                  Edit Profile
                </Button>
                <Button
                  mode="outlined"
                  style={styles.passwordButton}
                  onPress={() => {}}
                  icon="lock"
                >
                  Change Password
                </Button>
              </View>
            </>
          )}
        </Surface>

        {/* {(!myReviews || !wishlistItems || !myOrders) ? (
          <Skeleton />
        ) : (
          <MyActions 
            myReviews={myReviews} 
            wishlistItems={wishlistItems} 
            myOrders={myOrders}
          />
        )} */}
      </View>

      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={[
            styles.snackbar,
            snackbarType === "success" ? styles.successSnackbar : styles.errorSnackbar
          ]}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerBackground: {
    height: 200,
    width: '100%',
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    borderWidth: 3,
    borderColor: 'white',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  contentContainer: {
    padding: 16,
    marginTop: -30,
  },
  surface: {
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Constants.chosenFilterColor,
  },
  inputContainer: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: Constants.grayColor,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  editButton: {
    backgroundColor: Constants.chosenFilterColor,
    borderRadius: 8,
    paddingVertical: 8,
  },
  passwordButton: {
    borderColor: Constants.chosenFilterColor,
    borderRadius: 8,
    paddingVertical: 8,
  },
  submitButton: {
    backgroundColor: Constants.chosenFilterColor,
    borderRadius: 8,
    paddingVertical: 8,
  },
  cancelButton: {
    borderColor: Constants.chosenFilterColor,
    borderRadius: 8,
    paddingVertical: 8,
  },
  snackbar: {
    borderRadius: 8,
    margin: 16,
  },
  successSnackbar: {
    backgroundColor: '#4CAF50',
  },
  errorSnackbar: {
    backgroundColor: '#F44336',
  },
});

export default UserInfo;
