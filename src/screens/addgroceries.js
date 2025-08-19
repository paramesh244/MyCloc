
import React, { useEffect, useState } from 'react';
import * as SecureStore from "expo-secure-store";
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { ApiClient } from '../service/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
const AddGroceries = () => {
  const navigation=useNavigation()
  const [groceries, setGroceries] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const api = ApiClient()


  useEffect(() => {
  const fetchGroceries = async () => {
    try {
      const response = await api.get('/groceries');
      setGroceries(response.data.groceries);
    } catch (error) {
      console.error("Error fetching groceries:", error);
    }
  };

  fetchGroceries();
}, []);


  const handleAddItem =async(data) => {
   
    const existingItem = addedItems.find((item) => item.name === data.name);
    if (!existingItem) {
      api.post(`/groceries/add`,{ _id: data._id })
        .then((response) => {
          setMessage(response.data.message);
          setError('');
          setAddedItems([...addedItems, data]);
        })
        .catch((error) => {
          setError("Error adding item: " + error.response?.data?.message || error.message);
          setMessage('');
        });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.groceryCard}>
      <Text style={styles.groceryName}>{item.name}</Text>
      <View style={styles.imageContainer}>
      <Image 
     source={{ uri: "https://ruse-backend-1.onrender.com"+item.photo }} 
    //  source={require(`./assets${item.photo}`)} 
     style={styles.image} 
     />
        {addedItems.find(i => i.name === item.name) ? (
          <View style={styles.addedLabel}>
            <Text style={styles.labelText}>Added</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => handleAddItem(item)}
          >
            <Text style={styles.buttonText}>ADD</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  const handleLogout = () => {
    SecureStore.deleteItemAsync("token");
    SecureStore.deleteItemAsync("refreshToken");
    SecureStore.deleteItemAsync("username");
    SecureStore.deleteItemAsync("role");
    // AsyncStorage.clear();

    navigation.navigate("login");
  };

  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerText}>Add Groceries</Text>
<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        </View>
      {message ? (
        <View style={styles.successMessage}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      ) : null}

      {error ? (
        <View style={styles.errorMessage}>
          <Text style={styles.messageText}>{error}</Text>
        </View>
      ) : null}

      <FlatList
        data={groceries}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    backgroundColor: '#d4edda',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#e53935",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  groceryCard: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    elevation: 3, // for Android shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  groceryName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 120,
    objectFit: 'contain',
    borderRadius: 8,
  },
  addedLabel: {
    position: 'absolute',
    top: 30,
    right: 10,
    backgroundColor: '#28a745',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  labelText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    top: 80,
    right: 10,
    backgroundColor: '#007bff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  row: {
    justifyContent: 'space-between',
  }
};

export default AddGroceries;
