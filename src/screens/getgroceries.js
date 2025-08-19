import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { ApiClient } from '../service/api';

const OutOfStockGroceries = () => {
  const [outOfStockGroceries, setOutOfStockGroceries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
//   const API = process.env.REACT_APP_API;
  const navigation = useNavigation();
    const api = ApiClient();

  useEffect(() => {
    fetchOutOfStockGroceries();
  }, []);

  const fetchOutOfStockGroceries = async () => {
    setLoading(true);
    try {

      const response = await api.get(`/groceries/outofstock`);
      setOutOfStockGroceries(response.data.out_of_stock);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.error || "Error fetching out-of-stock groceries.");
      setLoading(false);
    }
  };

  const handleOrderClick = async (grocery) => {
    try {
      const response = await api.del(`/groceries/outofstock/delete`, {
        data: { _id: grocery._id }
      });
      console.log(response.data);
      setOutOfStockGroceries(outOfStockGroceries.filter((item) => item._id !== grocery._id));
      Alert.alert("Success", `${grocery.name} removed from out-of-stock list.`);
    } catch (error) {
      setError(error.response?.data?.error || `Error removing ${grocery.name} from out-of-stock list.`);
    }
  };

  const handleLaterClick = async (grocery) => {
    try {
      await api.put(
        `/groceries/outofstock/update`,
        { _id: grocery._id }
      );
      setOutOfStockGroceries(
        outOfStockGroceries.map((item) =>
          item._id === grocery._id ? { ...item, status: "Later" } : item
        )
      );
      Alert.alert("Success", `${grocery.name} marked as Later.`);
    } catch (error) {
      setError(error.response?.data?.error || `Error updating ${grocery.name}.`);
    }
  };

 const handleBackButtonClick = () => {
    navigation.navigate("homepage");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBackButtonClick} style={styles.backButton}>
        <Image source={require("../../assets/images/leftArrow.png")} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.title}>Out of Stock Groceries</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : outOfStockGroceries.length === 0 ? (
        <Text style={styles.noData}>No out-of-stock groceries found.</Text>
      ) : (
        <FlatList
          data={outOfStockGroceries}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.groceryName}>{item.name}</Text>
              <Image
                source={{ uri: "https://ruse-backend-1.onrender.com"+item.photo }}
                style={styles.image}
                resizeMode="contain"
              />
              

              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => handleLaterClick(item)}
                  style={styles.laterButton}
                >
                  <Text style={styles.buttonText}>Later</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleOrderClick(item)}
                  style={styles.orderButton}
                >
                  <Text style={styles.buttonText}>Ordered</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          numColumns={2} // Ensures 2 items per row
          columnWrapperStyle={styles.row} // Add spacing between rows
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginBottom: 20,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 16,
  },
  noData: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
  },
  row: {
    justifyContent: "space-between", // Ensures items are spaced evenly in the row
    marginBottom: 16, // Adds spacing between rows
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  groceryName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%", // Adjust width to make it more compact
    marginTop: 8, // Add spacing from the image
  },
  laterButton: {
    backgroundColor: "#f1c40f",
    paddingVertical: 6, // Reduced vertical padding
    paddingHorizontal: 12, // Reduced horizontal padding
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8, // Spacing between buttons
  },
  orderButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 6, // Reduced vertical padding
    paddingHorizontal: 12, // Reduced horizontal padding
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default OutOfStockGroceries;
