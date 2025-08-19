import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AuthService from "../../service/authService";
import StorageService from "../../service/storageservice";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const handleOnSubmit = async () => {
      //  navigation.navigate("homepage");
    setError("");
    if (!email && !password) {
      setError("missing username/password");
      return;
    }
    if (!email) {
      setError("username required");
      return;
    }
    if (!password) {
      setError("password required");
      return;
    }
    setLoading(true);
    try {
      let p = {
        email: email,
        password: password,
      };
      const data = await AuthService.login(p);

      console.log("response----->", data);

      if (data?.error) {
        setError(data.error);
      } else if (data?.flag === true) {
        navigation.navigate("homepage");
        await StorageService.setItem("token", data?.token);
        await StorageService.setItem("username", data?.username);
        await StorageService.setItem("role", data?.role);
        await StorageService.setItem("refreshToken", data?.refresh_token);
      } else if (data?.role === "maid" || data?.role === "Cook") {
        navigation.navigate("addgroceries");
        await StorageService.setItem("token", data?.token);
        await StorageService.setItem("username", data?.username);
        await StorageService.setItem("role", data?.role);
        await StorageService.setItem("refreshToken", data?.refresh_token);
      } else if (data?.flag === false && data?.role === "Owner") {
        navigation.navigate("approvalpending");
        await StorageService.setItem("flag", data?.flag.toString());
      } else {
        setError("Unauthorized");
      }
    } catch (err) {
      console.log(err);

      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/images/RuseLogo.png")}
          style={styles.logo}
        />
        <Text style={styles.welcomeText}>Welcome to MyCloc</Text>
      </View>

      {/* Display error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.form}>
        {/* Username Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={email}
            testID="emailInput"
            accessibilityLabel="emailInput"
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            testID="passwordInput"
            accessibilityLabel="passwordInput"
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        {/* Navigation Links */}
        <TouchableOpacity onPress={() => navigation.navigate("register")}>
          <Text style={styles.registerText}>New user? Register here</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity onPress={handleOnSubmit} style={styles.loginButton}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3D6464",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
  form: {
    width: "80%",
    padding: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#FFF",
  },
  registerText: {
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
    marginBottom: 10,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#3D6464",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
