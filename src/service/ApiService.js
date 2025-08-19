import { isObject } from "lodash";
import each from "lodash/each";
import mergeWith from "lodash/mergeWith";
import StorageService from "./storageservice";

const controller = new AbortController();
const signal = controller.signal;

const prepareParams = (params) => {
  let t = {};
  each(params, (e, k) => {
    t[k] = isObject(e) ? JSON.stringify(e) : e;
  });
  return new URLSearchParams(t);
};

const attachParamsToUrl = (url, params) => {
  if (Object.keys(params || {}).length > 0) {
    return url + "?" + prepareParams(params).toString();
  } else {
    return url;
  }
};

const getCall = (url, params, config) => {
  console.log("GET--", attachParamsToUrl(url, params));
  return fetch(attachParamsToUrl(url, params), {
    signal,
    method: "GET",
    ...config,
  });
};

const postCall = (url, params, config, ignoreStringify) => {
  console.log("POST--", url, JSON.stringify(params));
  return fetch(url, {
    signal,
    method: "POST",
    body: ignoreStringify ? params : JSON.stringify(params),
    ...config,
  });
};

const putCall = (url, params, config) => {
  console.log("PUT--", url, JSON.stringify(params));
  return fetch(url, {
    signal,
    method: "PUT",
    body: JSON.stringify(params),
    ...config,
  });
};

class ApiService {
  static async request(
    url,
    params,
    method,
    config = {},
    ignoreStringify = false,
    bufferData = false
  ) {
    const m = (method || "get").toLowerCase();

    let defaultConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const token = await StorageService.getItem("token");

    if (token) {
      defaultConfig.headers.Authorization = `Bearer ${token}`;
    }

    let c = mergeWith({}, defaultConfig, config || {});

    let req;
    switch (m) {
      case "get":
        req = await getCall(url, params, c);
        break;
      case "post":
        req = await postCall(url, params, c, ignoreStringify);
        break;
      case "put":
        req = await putCall(url, params, c);
        break;
      default:
        req = await getCall(url, params, c);
    }

    try {
      if (req.status === 440) {
        // If token is missing or expired, clear storage and navigate to Login
        await StorageService.setItem("token", "");
        // Optionally clear other sensitive data here
        if (typeof global !== "undefined" && global.navigationRef) {
          global.navigationRef.reset({
            index: 0,
            routes: [{ name: "login" }],
          });
        }
        throw new Error("Session expired, redirect to login");
      }
      if (bufferData) {
        return await req.arrayBuffer();
      }
      return await req.json();
    } catch (error) {
      return error;
    }
  }
}

export default ApiService;
