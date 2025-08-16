import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  Image,
  StyleSheet, 
  ActivityIndicator,
  Platform
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ApiClient } from "./api";
import { useNavigation } from "expo-router";
import leftArrowIcon from '../assets/images/leftArrow.png';
import {Linking } from 'react-native';


export default function Warranty() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_name: "",
    product_type: "",
    brand: "",
    purchase_date: "",
    warranty: "",
    price: "",
  });
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const API = ApiClient();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/warranties/getData`);
      setProducts(response.data.data || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      if (
        !formData.product_name ||
        !formData.product_type ||
        !formData.brand ||
        !formData.purchase_date ||
        !formData.warranty
      ) {
        setError("All fields except price are required.");
        return;
      }

      const currentDate = new Date();
      const purchaseDate = new Date(formData.purchase_date);
      if (purchaseDate > currentDate) {
        setError("Purchase date cannot be in the future.");
        return;
      }

      const response = await API.post(`/warranties/addData`, formData);
      setAlertMessage(response.data.message);
      setFormData({
        product_name: "",
        product_type: "",
        brand: "",
        purchase_date: "",
        warranty: "",
        price: "",
      });
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError("Failed to add product. Please check the data and try again.");
    }
  };

  const handleRemoveProduct = async (productId) => {
  try {
    const response = await API.del('/warranties/delete', {
      data: { product_id: productId }, 
    });
    setAlertMessage(response.data.message);
    fetchProducts();
  } catch (err) {
    setError("Failed to remove product. Please try again.");
  }
};



  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setFormData({ ...formData, purchase_date: formattedDate });
    }
  }; 
  const handleBackButtonClick = () => {
    navigation.navigate("homepage");
  };
  const calculateWarrantyLeft = (purchaseDate, warranty) => {
    const currentDate = new Date();
    const endDate = new Date(purchaseDate);
    endDate.setMonth(endDate.getMonth() + parseInt(warranty, 10));
    const diff = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24 * 30));
    return diff > 0 ? diff : 0;
  };
 

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
    <TouchableOpacity onPress={handleBackButtonClick} >
                            <Image source={leftArrowIcon} style={styles.backIcon} />
                          </TouchableOpacity>
      <Text style={styles.header}>Track Warranties</Text>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {alertMessage ? <Text style={styles.alertMessage}>{alertMessage}</Text> : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {showForm ? (
        <View style={styles.form}>
          <TextInput
            placeholder="Product Name"
            style={styles.input}
            value={formData.product_name}
            onChangeText={(text) =>
              setFormData({ ...formData, product_name: text })
            }
          />
          <TextInput
            placeholder="Product Type"
            style={styles.input}
            value={formData.product_type}
            onChangeText={(text) =>
              setFormData({ ...formData, product_type: text })
            }
          />
          <TextInput
            placeholder="Brand"
            style={styles.input}
            value={formData.brand}
            onChangeText={(text) =>
              setFormData({ ...formData, brand: text })
            }
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              placeholder="Purchase Date (YYYY-MM-DD)"
              style={styles.input}
              value={formData.purchase_date}
              editable={false}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
            />
          )}
          <TextInput
            placeholder="Warranty (in months)"
            style={styles.input}
            keyboardType="numeric"
            value={formData.warranty}
            onChangeText={(text) =>
              setFormData({ ...formData, warranty: text })
            }
          />
          <TextInput
            placeholder="Price"
            style={styles.input}
            keyboardType="numeric"
            value={formData.price}
            onChangeText={(text) =>
              setFormData({ ...formData, price: text })
            }
          />
          <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
            <Text style={styles.buttonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.product_name}</Text>
              <Text>Price: ₹ {item.price}</Text>
              <Text>Purchase Date: {item.purchase_date}</Text>
              <Text>
                Warranty Left: {calculateWarrantyLeft(item.purchase_date, item.warranty)} months
              </Text>
              <View style={styles.cardActions}>
              <TouchableOpacity
                    style={styles.findButton}
                    onPress={() =>
                      Linking.openURL(`https://www.google.com/search?q=${item.brand}+service+center+near+me`)
                          }
                      >
                    <Text style={styles.findButtonText}>Find Service Centers</Text>
              </TouchableOpacity>
                {/* <TouchableOpacity
                  style={styles.findButton}
                  // onPress={() => navigation.navigate("servicecenter")}
                  onPress={() => navigation.navigate(`https://www.google.com/search?q=${item.brand}+service+center+near+me`)}
                >
                  <Text style={styles.findButtonText}>Find Service Centers</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveProduct(item._id)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {!showForm && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  alertMessage: { color: "green", marginBottom: 10 },
  error: { color: "red", marginBottom: 10 },
  form: { marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#007BFF", padding: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  card: { padding: 15, backgroundColor: "#fff", marginBottom: 10, borderRadius: 8 },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  cardActions: { flexDirection: "row", marginTop: 10 },
  findButton: { marginRight: 10, padding: 10, backgroundColor: "#4CAF50", borderRadius: 5 },
  findButtonText: { color: "#fff" },
  removeButton: { padding: 10, backgroundColor: "#FF0000", borderRadius: 5 },
  removeButtonText: { color: "#fff" },
  addButton: { padding: 15, backgroundColor: "#007BFF", alignItems: "center", borderRadius: 8 },
  addButtonText: { color: "#fff", fontWeight: "bold" },
});
