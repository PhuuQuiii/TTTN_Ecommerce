import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_BASE_URL } from "../../utils/common";
import {
  getTokenService,
  uploadImageService
} from "../../utils/commonService";

export class UserService {
  async getUserProfile(id) {
    const token = await AsyncStorage.getItem("token");
    let url = `${SERVER_BASE_URL}/api/user/${id}`;
    let data = getTokenService(url, "GET", token);
    return data;
  }

  async updateProfile(profile, id) {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Remove sensitive fields from profile
      const { salt, password, resetPasswordLink, emailVerifyLink, location, ...updateData } = profile;
      
      // Log the request details for debugging
      // console.log('Update profile request:', {
      //   url: `${SERVER_BASE_URL}/api/user`,
      //   method: 'PUT',
      //   data: updateData,
      //   token: token.substring(0, 10) + '...' // Log only first 10 chars of token
      // });

      // Send request using fetch directly to have more control
      const response = await fetch(`${SERVER_BASE_URL}/api/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(updateData)
      });

      // Log the raw response for debugging
      // console.log('Update profile response status:', response.status);
      // const responseText = await response.text();
      // console.log('Update profile raw response:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        // console.error('Failed to parse response as JSON:', e);
        throw new Error('Invalid response format from server');
      }

      return {
        isSuccess: true,
        data: data
      };
    } catch (error) {
      // console.error('Update profile error:', error);
      return {
        isSuccess: false,
        errorMessage: error.message || 'Failed to update profile'
      };
    }
  }

  async updateProfilePicture(body, token) {
    let url = `${SERVER_BASE_URL}/api/user`;
    let data = uploadImageService(url, "PATCH", body, token);
    return data;
  }

  async getMyReviews(query, token) {
    let url = `${SERVER_BASE_URL}/api/review-qna/my-reviews?${query}&perPage=5`;
    let data = uploadImageService(url, "GET", null, token);
    return data;
  }
}
