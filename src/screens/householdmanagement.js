// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import React, { useEffect, useState ,useCallback } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import leftArrowIcon from "../../assets/images/leftArrow.png";
const maid = require('../../assets/images/maid.png');
const fulltime = require('../../assets/images/fulltime.png');
const caretaker = require('../../assets/images/babysitter.png');
const nanny = require('../../assets/images/nanny.png');
const gardener = require('../../assets/images/gardener.png');
const watchman = require('../../assets/images/watchman.png');
const housekeeper = require('../../assets/images/housekeeeper.png');
const laundryman = require('../../assets/images/laundry.png');
const petsetter = require('../../assets/images/dog.png');
const chauffeur = require('../../assets/images/chauffeur.png');
const carcleaner = require('../../assets/images/carcleaner.png');
const defaultImage = require('../../assets/images/maid.png');
const driver = require('../../assets/images/driver.png');
const cook = require('../../assets/images/cook.png');
import { ApiClient } from '../service/api';

const HouseholdManagement = () => {
  const [roles, setRoles] = useState([]);
  const [househelps, setHousehelps] = useState([]);
  const navigation = useNavigation();
  const api = ApiClient();

  const roleImageMapping = {
    "maid": maid,       
    "Cook": cook,      
    "Driver": driver,  
    "Full-time Worker":fulltime,
    "Caretaker":caretaker,
    "Nanny":nanny,
    "Gardener":gardener,
    "Watchman":watchman,
    "Housekeeper":housekeeper,
    "Laundryman":laundryman,
    "Pet-sitter":petsetter,
    "Chauffeur":chauffeur,
    "Car Cleaner":carcleaner,
    
  };

  useEffect(() => {
    fetchHousehelps();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('https://ruse-backend-1.onrender.com/househelp/categories/all');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      Alert.alert("Error", "Failed to fetch roles");
    }
  };

  const fetchHousehelps = async () => {
    try {
  
      const response = await api.get(
        'https://ruse-backend-1.onrender.com/househelp/cat');
      
      const categories = response.data.categories || [];
      setHousehelps(categories);
    } catch (error) {
      console.error("Error fetching home details:", error.message);
      Alert.alert("Error", "Failed to fetch househelps. Please try again later.");
    }
  };

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  const handleAddHousehelpClick = () => {
    navigation.navigate("househelp");
  };
  
  const handleRoleClick = useCallback((role) => {
    navigation.navigate("househelpdetails", { role });
  }, [navigation]);
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButtonClick}>
          <Image source={leftArrowIcon} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>My home house helps</Text>
      </View>

      {househelps.length > 0 ? (
        <FlatList
          data={househelps}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => ( 
            // const roleImage = roleImageMapping[househelp.category_name] || defaultImage; 
            <TouchableOpacity style={styles.househelpContainer} onPress={() => handleRoleClick(item.category_name)}>
      <View style={styles.imageContainer}>
        <Image
          source={roleImageMapping[item.category_name]}
          style={styles.image}
        />
      </View>
      <Text style={styles.househelpText}>{item.category_name}</Text>
    </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer} >
          <Text style={styles.emptyText}>No househelps found</Text>
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddHousehelpClick}>
        <Text style={styles.addButtonText}>Add Househelp</Text>
      </TouchableOpacity>
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
  imageContainer: {
    marginRight: 8,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  househelpContainer: {
    flexDirection: 'row',  
    alignItems: 'center',  
    marginVertical: 8,     
    padding: 10,  
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
  },
  househelpText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 30,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 32,  
    height: 32, 
    borderRadius: 16,
  },
});

export default HouseholdManagement;
