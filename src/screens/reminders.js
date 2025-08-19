import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import leftArrowIcon from "../../assets/images/leftArrow.png";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiClient } from '../service/api';
export default function Reminders() {
  const [reminders, setReminders] = useState(null);
  const navigation = useNavigation();
//   const API = process.env.REACT_APP_API;
const api = ApiClient();
  const handleBackButtonClick = () => {
    navigation.goBack();
  };
 
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        // const token = await AsyncStorage.getItem('token');
        // if (!token) {
        //   console.error('No token found');
        //   return;
        // }
 
        const response = await api.get('/reminders');
        const data = await response.data;
        console.log(data)
        setReminders(data);
      } catch (error) {
        console.error('Error fetching reminders:', error);
      }
    };
 
    fetchReminders();
  }, []);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackButtonClick}>
          <Image source={leftArrowIcon} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.title}>Reminders</Text>
      </View>
 
      <View style={styles.remindersContainer}>
        {reminders && (
          <>
            {reminders.family_members_approval > 0 && (
              <TouchableOpacity
                style={styles.reminderCard}
                onPress={() => navigation.navigate('addFamily')}
              >
                <Text style={styles.reminderText}>
                  {reminders.family_members_approval} family members waiting for approval
                </Text>
              </TouchableOpacity>
            )}
 
            {reminders.electricity_due_reminders.length > 0 &&
              reminders.electricity_due_reminders.map((reminder, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.reminderCard}
                  onPress={() => navigation.navigate('electricity')}
                >
                  <Text style={styles.reminderText}>{reminder}</Text>
                </TouchableOpacity>
              ))}
 
            {reminders.groceries_pending > 0 && (
              <TouchableOpacity
                style={styles.reminderCard}
                onPress={() => navigation.navigate('getgroceries')}
              >
                <Text style={styles.reminderText}>
                  {reminders.groceries_pending} groceries items need to be ordered - click to order
                </Text>
              </TouchableOpacity>
            )}
 
            {reminders.househelp_pending_payments.length > 0 &&
              reminders.househelp_pending_payments.map((reminder, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.reminderCard}
                  onPress={() => navigation.navigate('householdmanagement')}
                >
                  <Text style={styles.reminderText}>{reminder}</Text>
                </TouchableOpacity>
              ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  remindersContainer: {
    flex: 1,
  },
  reminderCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  reminderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});
 
