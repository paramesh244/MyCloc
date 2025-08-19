import * as SecureStore from "expo-secure-store";

class StorageService {
  static async setItem(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.log("error---------",error);
    }
  }

  static async getItem(key) {
    try {
      const val = await SecureStore.getItemAsync(key);
      return val;
    } catch (error) {
      return "";
    }
  }
}

export default StorageService;
