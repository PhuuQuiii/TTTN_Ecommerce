import { SERVER_BASE_URL } from "../../utils/common";
import { postService } from "../../utils/commonService";

export class AuthService {
  async loginUser(body) {
    let url = `${SERVER_BASE_URL}/api/user-auth/signin`;
    // console.log('API URL:', url);
    // console.log('Request body:', body);
    let data = await postService(url, "POST", body);
    // console.log('API response:', data);
    return data;
  }

  async signupUser(body) {
    let url = `${SERVER_BASE_URL}/api/user-auth/signup`;
    // console.log('Signup API URL:', url);
    // console.log('Signup Request body:', body);
    let data = await postService(url, "POST", body);
    // console.log('Signup API response:', data);
    return data;
  }
}
