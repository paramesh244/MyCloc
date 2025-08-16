import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
 
// const API_URL = process.env.REACT_APP_API;
const API_URL= "https://ruse-backend-1.onrender.com"
 
export const ApiClient = () => {
    // Create a new axios instance
    const api = axios.create({
        baseURL: API_URL,
        headers: {
            "Content-Type": "application/json",
        },
    });
   
    // Add a request interceptor to add the JWT token to the authorization header
    api.interceptors.request.use(
       async (config) => {
         const token =await AsyncStorage.getItem("token");
         
         if (token) {
           config.headers.Authorization = `Bearer ${token}`
 
          }
          return config;
        },
         (error) => Promise.reject(error)
        //(error) => console.LOG(error)
    );
 
    createAxiosResponseInterceptor();
 
    function createAxiosResponseInterceptor() {
      const interceptor = api.interceptors.response.use(
          (response) => {
            console.log("RETURN REPONSE INSTEAD ERRRO")
            console.log(response)
            return response
          },
          async (error) => {
            console.log(error.response.status)
              // Reject promise if usual error
              if (error.response.status !== 401) {
                  return Promise.reject(error);
              }
              if (
                error.response.status === 401 &&
                AsyncStorage.getItem("refreshToken")
                ) {
                  try {
                    api.interceptors.response.eject(interceptor);
                   
                    const refreshToken = await AsyncStorage.getItem("refreshToken");

                    //console.error("Error at API AXIOS", error.response.status, refreshToken)
                   
                    const url = `https://ruse-backend-1.onrender.co/refresh`;

                    
 
 
                    // const body = refreshToken;
                    const headers = {

                      'Authorization':`Bearer ${refreshToken}`
                    };
                   
                    const response = await axios.post(url,null,{headers:headers})
                    //console.log("refreshTokenresponse",response)

                      
                   
                    
                    await AsyncStorage.setItem("token",response.data.token);
                    // await AsyncStorage.setItem("refreshToken",refreshToken);
                    console.LOG("Successfully refresh token")
 
                    error.response.config.headers["Authorization"] =
                          "Bearer " + response.data.token;
                    return axios(error.response.config)
                  }
                  catch(err) {
                    console.error("Error at refresh token", err.response.status)
                   
                    //If refresh token is invalid, you will receive this error status and log user out
                    if (err.response.status === 400) {
                      throw { response: { status: 401 } };
                    }
                    return Promise.reject(err);
                  }
                  finally{createAxiosResponseInterceptor};
            }
          }
      );
    }
    const get = (path, params) => {
        return api.get(path,{params}).then((response) => response);
    };
 
    const post = (path, body, params) => {
        return api.post(path, body, params).then((response) => response);
    };
 
    const put = (path, body, params) => {
        return api.put(path, body, params).then((response) => response);
    };
 
    const patch = (path, body, params) => {
      return api.patch(path, body, params).then((response) => response);
  };
 
    const del = (path,body,params) => {
        return api.delete(path,body,params).then((response) => response);
    };
    return {
        get,
        post,
        patch,
        put,
        del,
    };
};