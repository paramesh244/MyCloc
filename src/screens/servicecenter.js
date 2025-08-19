import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  StyleSheet, 
  ActivityIndicator ,
  Linking
} from "react-native";
import axios from "axios";
import { ApiClient } from "../service/api";

 
export default function ServiceCenter() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_name: "",
    product_type: "",
    brand: "",
    purchase_date: "",
    warranty: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const API = ApiClient()
 
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/warranties/getData`);
      setProducts(response.data.data || []);
      setError("");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Failed to fetch products.");
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
      const response = await API.delete(`/warranties/delete`, {
        data: { product_id: productId },
      });
      setAlertMessage(response.data.message);
      fetchProducts();
    } catch (err) {
      setError("Failed to remove product. Please try again.");
    }
  };
  

  const openLink = (brand) => {
    const url = `https://www.google.com/search?q=${brand}+service+center+near+me`;
    Linking.openURL(url).catch((err) =>
      console.error('Failed to open URL:', err)
    );
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
<>
<View style={styles.container}>
<Text style={styles.header}>Service Centers Near You</Text>
 
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
 
      {alertMessage ? (
<Text style={styles.alertMessage}>{alertMessage}</Text>
      ) : null}
 
      {error ? <Text style={styles.error}>{error}</Text> : null}
 
     
</View>

<view style={styles.card}>
<Text>
    service center1
</Text>
    
</view>
    
      
      
</>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5",paddingTop: 60},
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