import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { ApiClient } from './api';
 
const AddFamilyPage = () => {
//   const API = process.env.REACT_APP_API;
//   const token = localStorage.getItem('token');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [familyMembersError, setFamilyMembersError] = useState('');
  const [membersError, setMembersError] = useState('');
  const navigation = useNavigation();
  const api = ApiClient();
    useEffect(() => {
    fetchFamilyMembers();
    fetchMembers();
  }, []);
 
  const fetchFamilyMembers = async () => {
    try {
      const response = await api.get('/getPendingMembers');
     
      const pendingMembers = response.data.members || [];
      if (pendingMembers.length === 0) {
        setFamilyMembersError(response.data.message || 'No pending family members found.');
      } else {
        setFamilyMembers(pendingMembers);
        setFamilyMembersError('');
      }
    } catch (error) {
      setFamilyMembersError(error.response?.data?.message || 'Failed to load family members.');
    }
  };
 
  const fetchMembers = async () => {
    try {
      const response = await api.get('/getMembers');
      const allMembers = response.data.members || [];
      if (allMembers.length === 0) {
        setMembersError(response.data.message || 'No family members found.');
      } else {
        setMembers(allMembers);
        setMembersError('');
      }
    } catch (error) {
      setMembersError(error.response?.data?.message || 'Failed to load members.');
    }
  };
 
  const handleStatus = async (memberId, status) => {
    try {
      await api.put('/familyMembers/updateStatus',
        { memberId, status});
 
      setFamilyMembers((prevMembers) =>
        prevMembers.filter((member) => member._id !== memberId)
      );
 
      if (status === 'approved') {
        const approvedMember = familyMembers.find((member) => member._id === memberId);
        setMembers((prevMembers) => [...prevMembers, { ...approvedMember, isApproved: true }]);
      }
      window.location.reload();
    } catch (error) {
      setFamilyMembersError('Failed to approve/reject family member.');
    }
  };
 
  const handleBackButtonClick = () => {
    navigation.navigate("homepage");
  };
 
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBackButtonClick} style={styles.backButton}>
        <Image source={require('../assets/images/leftArrow.png')} style={styles.backIcon} />
      </TouchableOpacity>
 
      {familyMembers.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Pending Family Members</Text>
          <FlatList
            data={familyMembers}
            keyExtractor={(item) => item.email}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View>
                  <Text style={styles.cardTitle}>{item.firstname}</Text>
                  <Text style={styles.cardSubtitle}>{item.email}</Text>
                </View>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={[styles.button, styles.approveButton]}
                    onPress={() => handleStatus(item._id, 'approved')}
                  >
                    <Text style={styles.buttonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.rejectButton]}
                    onPress={() => handleStatus(item._id, 'rejected')}
                  >
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      )}
 
      {members.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>All Family Members</Text>
          <FlatList
            data={members}
            keyExtractor={(item) => item.email}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View>
                  <Text style={styles.cardTitle}>{item.firstname}</Text>
                  <Text style={styles.cardSubtitle}>{item.email}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => handleStatus(item._id, 'pending')}
                >
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}
 
      {familyMembers.length === 0 && members.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Family members not added</Text>
        </View>
      )}
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    padding: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  buttonGroup: {
    flexDirection: 'column',
    marginLeft: 'auto',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
 
export default AddFamilyPage;