import { API_ENDPOINT } from "../../constants";
import ApiService from "./ApiService";

class utilityService {
  static getGasData(params) {
    return ApiService.request(API_ENDPOINT + "/gas_consumption/last_three_months", params, "GET");
  }

    static getGasMonthlyData(params) {
    return ApiService.request(API_ENDPOINT + "/gas_consumption/monthly_days", params, "GET");
  }
}

export default utilityService;
