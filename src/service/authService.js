import { API_ENDPOINT } from "../../constants";
import ApiService from "./ApiService";

class AuthService {
  static login(params) {
    return ApiService.request(API_ENDPOINT + "/login", params, "POST");
  }
}

export default AuthService;
