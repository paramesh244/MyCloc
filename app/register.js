import React, { useState } from "react";
import { Image } from "react-native";
import { useNavigation } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";

import logo from "../assets/images/RuseLogo.png"; 

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleOnSubmit = async () => {
    setLoading(true);
    setError("");

    // Validation logic
    if (!/^[A-Za-z]+$/.test(firstname)) {
      setLoading(false);
      setError("First name must contain alphabets only.");
      return;
    }

    if (!/^[A-Za-z]+$/.test(lastname)) {
      setLoading(false);
      setError("Last name must contain alphabets only.");
      return;
    }

    if (!/^[A-Za-z0-9 .'-]+$/.test(buildingName)) {
      setLoading(false);
      setError("Building name must be alphanumeric and may include '.', '-', or spaces.");
      return;
    }

    if (!/^[0-9]+$/.test(flatNo)) {
      setLoading(false);
      setError("Flat number must be digits only.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLoading(false);
      setError("Invalid email format.");
      return;
    }

    if (password.length < 6) {
      setLoading(false);
      setError("Password length should be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch('https://ruse-backend-1.onrender.com/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          building_name: buildingName,
          flat_no: flatNo,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data?.error) {
        setError(data?.error);
      } else {
        Alert.alert("Registration Successful", "You can now log in.", [
          { text: "OK", onPress: () => navigation.navigate("index") },
        ]);
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Welcome to MyCloc</Text>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            onChangeText={setFirstname}
            value={firstname}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            onChangeText={setLastname}
            value={lastname}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Building Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your building name"
            onChangeText={setBuildingName}
            value={buildingName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Flat No</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your flat number"
            onChangeText={setFlatNo}
            value={flatNo}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            secureTextEntry
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("index")}
          style={styles.linkContainer}
        >
          <Text style={styles.linkText}>Already Registered? Click to login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleOnSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    color: "#3D6464",
    marginTop: 10,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  form: {
    marginVertical: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#333",
  },
  button: {
    backgroundColor: "#3D6464",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  linkText: {
    color: "#3D6464",
    fontSize: 12,
  },
});

export default Register;
