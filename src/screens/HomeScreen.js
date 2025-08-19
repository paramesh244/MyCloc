import { useNavigation } from '@react-navigation/native';
import { useState,useEffect } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import * as SecureStore from "expo-secure-store";
import { ApiClient } from '../service/api';



const HomeScreen = () => {
  const [homeDetails, setHomeDetails] = useState({});

  const [username,setUserName] = useState(" ");
  const navigation = useNavigation();
  const Api = ApiClient();


  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = await SecureStore.getItemAsync("username");
        setUserName(user);
      } catch (error) {
        console.error("Error fetching username from AsyncStorage:", error);
      }
    };
 
    fetchUserName();
  }, []);
 
  useEffect(() => {
    const fetchHomeDetails = async () => {
      try {
      
        const response = await Api.get(`/home`);
        setHomeDetails(response.data);
      } catch (error) {
        Alert.alert("Error", "Error fetching home details.");
        console.error("Error fetching home details:", error);
      }
    };
    fetchHomeDetails();
  }, []);
 





  const  handleLogout =()=>{

     SecureStore.deleteItemAsync("token");
        SecureStore.deleteItemAsync("refreshToken");
        SecureStore.deleteItemAsync("username");
        SecureStore.deleteItemAsync("role");
        navigation.navigate("login");


  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Home</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
 
      <Text style={styles.welcomeText}>Hello, {username}</Text>
      <Text style={styles.infoText}>You are currently staying in</Text>
 
      <View style={styles.card}>
        <Image source={require("../../assets/images/RoomImg.jpg")} style={styles.roomImage} />
        <View style={styles.cardDetails}>
          <Text style={styles.flatText}>Flat No {homeDetails.flat}</Text>
          <Text style={styles.nameText}>{homeDetails.name}</Text>
        </View>
      </View>
 
      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate("householdmanagement")}>
          <Image source={require("../../assets/images/HouseHold.png")} style={styles.icon} />
          <Text style={styles.gridText}>Household Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate("addFamily")}>
          <Image source={require("../../assets/images/family.png")} style={styles.icon} />
          <Text style={styles.gridText}>Add Family</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate("getgroceries")}>
          <Image source={require("../../assets/images/Groceries.png")} style={styles.icon} />
          <Text style={styles.gridText}>Groceries</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate("utilities")}>
          <Image source={require("../../assets/images/Utilities.png")} style={styles.icon} />
          <Text style={styles.gridText}>Utilities</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate("reminders")}>
          <Image source={require("../../assets/images/reminder.png")} style={styles.icon} />
          <Text style={styles.gridText}>Remainder</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate("warranties")}>
          <Image source={require("../../assets/images/warranty.jpg")} style={styles.icon} />
          <Text style={styles.gridText}>Warranties</Text>
        </TouchableOpacity>

      </View>
 
      {/* <View style={styles.voiceCommand}>
        <Text style={styles.voiceText}>Try saying "What is last month energy consumption"</Text>
        <TouchableOpacity>
          <Image source={require("../../assets/images/mic.png")} style={styles.micIcon} />
        </TouchableOpacity>
      </View> */}
 
      <Text style={styles.footer}>Powered by Rusé</Text>
    </ScrollView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 60,
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
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
    marginBottom: 20,
  },
  roomImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  cardDetails: {
    flex: 1,
    justifyContent: "center",
    padding: 12,
  },
  flatText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  nameText: {
    fontSize: 14,
    color: "#666",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  gridItem: {
    width: "48%",
    alignItems: "center",
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  gridText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  voiceCommand: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  voiceText: {
    flex: 1,
    fontSize: 14,
    color: "#555",
  },
  micIcon: {
    width: 40,
    height: 40,
  },
  footer: {
    fontSize: 12,
    textAlign: "center",
    color: "#aaa",
  },
});
 
export default HomeScreen;