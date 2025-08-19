
// import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ApiClient } from '../service/api';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// const API = process.env.REACT_APP_API;

const AddHousehelp = () => {
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState(null);
  const [newHouseHelp, setNewHouseHelp] = useState({
    name: "",
    phone_number: "",
    photo: "/images/user.png",
    address: "",
    gender: "",
    adhar: "",
    start_date: "",
    end_date: "",
    payment_mode: "",
    UPI_ID: "",
    acc: "",
    ifsc: "",
    payment_type: "",
    payment_status: "Pending",
    total_value: "",
    payment_date: "",
    verified: false,
    role: "",
  });
  const navigation = useNavigation();
   const api = ApiClient();
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
   const [showPaymentDatePicker, setPaymentDatePicker] = useState(false);
  const [error,setError]= useState();
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      // const storedToken = await localStorage.getItem("token");
      setToken(storedToken);
    };

    fetchToken();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await api.get(
        '/househelp/categories/all'
      );
      // console.log("fetch roles response=",response )
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error.message || error);
      Alert.alert("Error", "Failed to fetch roles. Please check your network.");
    }
  };

  const handleInputChange = (name, value) => {
    setNewHouseHelp((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setNewHouseHelp((prev) => ({
        ...prev,
        start_date: selectedDate.toLocaleDateString('en-CA'),
      }));
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setNewHouseHelp((prev) => ({
        ...prev,
        end_date: selectedDate.toLocaleDateString('en-CA'),
      }));
    }
  };
  const handlePaymentDateChange = (event, selectedDate) => {
    setPaymentDatePicker(false);
    if (selectedDate) {
      setNewHouseHelp((prev) => ({
        ...prev,
        payment_date: selectedDate.toLocaleDateString('en-CA'),
      }));
    }
  };
  const validateFields = () => {
    const newErrors = {};
    const currentDate = new Date().toISOString().split("T")[0]; // Get the current date in 'YYYY-MM-DD' format
  
    // Validate name
    if (!newHouseHelp.name.trim()) {
      newErrors.name = "Name is required.";
    }
  
    // Validate phone number
    if (newHouseHelp.phone_number && !/^\d{10}$/.test(newHouseHelp.phone_number)) {
      newErrors.phone_number = "Valid 10-digit phone number is required.";
    }
  
    // Validate Aadhaar number
    if (newHouseHelp.aadhaar && !/^\d{12}$/.test(newHouseHelp.aadhaar)) {
      newErrors.aadhaar = "Aadhaar number must be exactly 12 digits.";
    }
  
    // Validate end date
    if (newHouseHelp.end_date && newHouseHelp.end_date <= currentDate) {
      newErrors.end_date = "End date must be greater than the current date.";
    }
  
    // Validate UPI ID for UPI payment mode
    if (newHouseHelp.payment_mode === "UPI" && !newHouseHelp.UPI_ID.trim()) {
      newErrors.UPI_ID = "UPI ID is required for UPI payment mode.";
    }
  
    // Validate account number and IFSC code for bank transfer
    if (
      newHouseHelp.payment_mode === "Account" &&
      (!newHouseHelp.acc.trim() || !newHouseHelp.ifsc.trim())
    ) {
      newErrors.acc = "Account number is required for bank transfer.";
      newErrors.ifsc = "IFSC code is required for bank transfer.";
    }
  
    setErrors(newErrors); // Set the error state
    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };
  
  const handleAddHousehelp = async () => {
    // if (!validateFields()) {
    //   return;
    // }
    try {
      console.log("token=", token)
      const response = await api.post(
        '/househelp/add',
        { ...newHouseHelp }
       
      );
      Alert.alert("Success", "Househelp added successfully!");
      navigation.navigate('househelpdetails', { role: newHouseHelp.role });// Navigate back to the previous screen
    } catch (error) {
    
      console.error("Error adding househelp:", error.message);
      Alert.alert("Error", "Failed to add househelp. Please try again.");
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add Househelp</Text>

      {/* Multi-Column Form Layout */}
      <View style={styles.formRow}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={newHouseHelp.name}
          onChangeText={(value) => handleInputChange("name", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={newHouseHelp.phone_number}
          onChangeText={(value) => handleInputChange("phone_number", value)}
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.formRow}>
        <TextInput
          style={styles.input}
          placeholder="Aadhar"
          value={newHouseHelp.adhar}
          onChangeText={(value) => handleInputChange("adhar", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={newHouseHelp.address}
          onChangeText={(value) => handleInputChange("address", value)}
        />
      </View>
      <View style={styles.formRow}>
        <TouchableOpacity
          onPress={() => setShowStartDatePicker(true)}
          style={styles.datePicker}
        >
          <Text>
            {newHouseHelp.start_date || "Select Start Date"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowEndDatePicker(true)}
          style={styles.datePicker}
        >
          <Text>
            {newHouseHelp.end_date || "Select End Date"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formRow}>
        <Picker
          selectedValue={newHouseHelp.role}
          onValueChange={(itemValue) => handleInputChange("role", itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Role" value="" />
          {roles.map((role) => (
            <Picker.Item key={role._id} label={role.category_name} value={role.category_name} />
          ))}
        </Picker>
      </View>

      {showStartDatePicker && (
        <DateTimePicker
          mode="date"
          value={new Date()}
          onChange={handleStartDateChange}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          mode="date"
          value={new Date()}
          onChange={handleEndDateChange}
        />
      )}

     {showPaymentDatePicker && (
        <DateTimePicker
          mode="date"
          value={new Date()}
          onChange={handlePaymentDateChange}
        />
      )}
      <View style={styles.formRow}>
      <Picker
        selectedValue={newHouseHelp.gender}
        onValueChange={(itemValue) => handleInputChange("gender", itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Gender" value="" />
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Other" value="Other" />
      </Picker>
      </View>
      <View style={styles.formRow}>
        <TextInput
          style={styles.input}
          placeholder="Total Value"
          value={newHouseHelp.total_value}
          onChangeText={(value) => handleInputChange("total_value", value)}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.formRow}>
        <Picker
          selectedValue={newHouseHelp.payment_type}
          onValueChange={(itemValue) =>
            handleInputChange("payment_type", itemValue)
          }
          style={styles.picker}
        >
          <Picker.Item label="Select Payment Type" value="" />
          <Picker.Item label="Daily" value="Daily" />
          <Picker.Item label="Weekly" value="Weekly" />
          <Picker.Item label="Monthly" value="Monthly" />
          <Picker.Item label="Yearly" value="Yearly" />
        </Picker>
      </View>

      <View style={styles.formRow}>
        <Picker
          selectedValue={newHouseHelp.payment_mode}
          onValueChange={(itemValue) => handleInputChange("payment_mode", itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Payment Mode" value="" />
          <Picker.Item label="UPI" value="UPI" />
          <Picker.Item label="Cash" value="Cash" />
          <Picker.Item label="Account Number" value="Account" />
        </Picker>
      </View>
      {/* Conditional Payment Mode Fields */}
      {newHouseHelp.payment_mode === "UPI" && (
        <View style={styles.formRow}>
          <TextInput
            style={styles.input}
            placeholder="UPI ID"
            value={newHouseHelp.UPI_ID}
            onChangeText={(value) => handleInputChange("UPI_ID", value)}
          />
        </View>
      )}
      {newHouseHelp.payment_mode === "Account" && (
        <View style={styles.formRow}>
          <TextInput
            style={styles.input}
            placeholder="Account Number"
            value={newHouseHelp.acc}
            onChangeText={(value) => handleInputChange("acc", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="IFSC Code"
            value={newHouseHelp.ifsc}
            onChangeText={(value) => handleInputChange("ifsc", value)}
          />
        </View>
        
      )}
      <View style={styles.formRow}>
        <TouchableOpacity
          onPress={() => setPaymentDatePicker(true)}
          style={styles.datePicker}
        >
          <Text>
            {newHouseHelp.payment_date || "Payment Date"}
          </Text>
        </TouchableOpacity>
        </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={handleAddHousehelp}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  datePicker: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});

export default AddHousehelp;
