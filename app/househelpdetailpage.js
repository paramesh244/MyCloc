import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Validation functions
const validateHousehelpName = (name) => /^[A-Za-z\s]+$/.test(name); // Check if name contains only alphabets
const validateMobileNumber = (number) => /^[0-9]{10}$/.test(number); // 10 digits
const validateAadharNumber = (aadhar) => /^[0-9]{12}$/.test(aadhar); // 12 digits
const validateAddress = (address) => address.trim().length > 0; // Simple check for non-empty address

const HousehelpDetailsPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { role } = route.params;
  const [househelpData, setHousehelpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHousehelpDetails();
  }, [role]);

  const fetchHousehelpDetails = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://ruse-backend-1.onrender.com/househelp/all?role=${role}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHousehelpData(response.data.househelps || []);
    } catch (err) {
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle validation when adding or updating househelp details
  const handleValidation = (househelp) => {
    if (!validateHousehelpName(househelp.name)) {
      Alert.alert("Error", "Name must contain alphabets.");
      return false;
    }

    if (!validateMobileNumber(househelp.phone_number)) {
      Alert.alert("Error", "Mobile number must contain 10 digits.");
      return false;
    }

    if (!validateAadharNumber(househelp.adhar)) {
      Alert.alert("Error", "Invalid Aadhar number.");
      return false;
    }

    if (!validateAddress(househelp.address)) {
      Alert.alert("Error", "Address format is invalid.");
      return false;
    }

    return true;
  };

  const handleAddHousehelp = (newHouseHelp) => {
    if (!handleValidation(newHouseHelp)) {
      return;
    }

    // Proceed with the API call to add or update househelp
    // Example: axios.post('/househelp/add', newHouseHelp)
  };

  const handleUpdateStatus = async (househelpId, status) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `https://ruse-backend-1.onrender.com/househelp/updatePaymentStatus`,
        {
          payment_status: status,
          user_id: househelpId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchHousehelpDetails();
    } catch (error) {
      Alert.alert("Error", "Failed to update payment status. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderHousehelpCards = () => (
    <FlatList
      data={househelpData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.header}>
            <Image
              source={require("../assets/images/user.png")}
              style={styles.image}
            />
            <View>
              <Text style={styles.name}>
                {item.role && item.personal_info.name
                  ? `${item.role} ${item.personal_info.name}`
                  : item.role || item.personal_info.name || "No Name"}
              </Text>
              {item.personal_info.phone_number && (
                <Text style={styles.text}>Phone: {item.personal_info.phone_number}</Text>
              )}
              {item.personal_info.gender && (
                <Text style={styles.text}>Gender: {item.personal_info.gender}</Text>
              )}
              {item.pin && <Text style={styles.text}>PIN: {item.pin}</Text>}
            </View>
          </View>
          {item.personal_info.address && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Address:</Text>
              <Text style={styles.text}>{item.personal_info.address}</Text>
            </View>
          )}
          {item.kyc_info && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>KYC Info:</Text>
              {item.kyc_info.adhar && (
                <Text style={styles.text}>Adhar: {item.kyc_info.adhar}</Text>
              )}
              <Text style={styles.text}>
                Verified: {item.kyc_info.verified ? "Yes" : "No"}
              </Text>
            </View>
          )}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Financial Info:</Text>
            {item.financial_info?.total_value && (
              <Text style={styles.text}>Total Value: ₹{item.financial_info.total_value}</Text>
            )}
            {item.payment_status && (
              <Text style={styles.text}>Payment Status: {item.payment_status}</Text>
            )}
            {item.financial_info?.payment_type && (
              <Text style={styles.text}>Payment Type: {item.financial_info.payment_type}</Text>
            )}
            {item.financial_info?.start_date && (
              <Text style={styles.text}>
                Start Date: {new Date(item.financial_info.start_date).toDateString()}
              </Text>
            )}
            {item.financial_info?.end_date && (
              <Text style={styles.text}>
                End Date: {new Date(item.financial_info.end_date).toDateString()}
              </Text>
            )}
          </View>
          {item.financial_info?.payment_details?.UPI_ID && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Mode:</Text>
              <Text style={styles.text}>UPI ID: {item.financial_info.payment_details.UPI_ID}</Text>
            </View>
          )}
          {item.financial_info?.payment_date && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Info:</Text>
              <Text style={styles.text}>Next Payment Date: {item.financial_info.payment_date}</Text>
            </View>
          )}
        </View>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require("../assets/images/leftArrow.png")} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.title}>Househelp Details</Text>
      {renderHousehelpCards()}
      {househelpData.househelps && househelpData.househelps.length > 0 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("househelp")}
        >
          <Text style={styles.addButtonText}>Add Househelp</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Style definitions remain the same...
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  backButton: {
    marginBottom: 16,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    marginBottom: 16,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    color: "#6c757d",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default HousehelpDetailsPage;
