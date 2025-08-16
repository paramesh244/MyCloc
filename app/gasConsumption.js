import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
  BackHandler
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart } from 'react-native-chart-kit';
import { ApiClient } from './api';
import { useNavigation } from '@react-navigation/native';
import leftArrowIcon from '../assets/images/leftArrow.png';

const screenWidth = Dimensions.get('window').width;

const GasConsumption = () => {
  const navigation = useNavigation();
  const api = ApiClient();

  const [isModalVisible, setModalVisible] = useState(false);
  const [showPickerDelivered, setShowPickerDelivered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [consumptionData, setConsumptionData] = useState([]);
  const [graphData, setGraphData] = useState({ labels: [], datasets: [{ data: [] }] });

  const [formData, setFormData] = useState({
    billNumber: '',
    consumerNumber: '',
    deliveredDate: '',
    totalWeight: '',
    amount: '',
  });

  useEffect(() => {
    fetchConsumptionData();
    fetchMonthlyDaysData();
  }, []);

  const fetchConsumptionData = async () => {
    try {
      const response = await api.get('/gas_consumption/last_three_months');
      setConsumptionData(response.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch gas consumption data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyDaysData = async () => {
    try {
      const response = await api.get('/gas_consumption/monthly_days');
      const data = response.data || [];

      const labels = [];
      const values = [];

      data.forEach(item => {
        const value = Number(item.days_consumed);
        if (!isNaN(value) && isFinite(value)) {
          labels.push(item.month);
          values.push(value);
        }
      });

      setGraphData({ labels, datasets: [{ data: values }] });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch monthly consumption graph.');
    }
  };

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDeliveredDateChange = (event, selectedDate) => {
    setShowPickerDelivered(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleInputChange('deliveredDate', formattedDate);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post('/gasConsumption/addData', {
        ...formData,
        totalWeight: parseFloat(formData.totalWeight),
        amount: parseFloat(formData.amount),
      });

      Alert.alert('Success', 'Gas data added successfully!');
      toggleModal();
      fetchConsumptionData();
      fetchMonthlyDaysData();
      setFormData({
        billNumber: '',
        consumerNumber: '',
        deliveredDate: '',
        totalWeight: '',
        amount: '',
      });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add gas consumption data.');
    }
  };

  const handleBackButtonClick = () => navigation.navigate('utilities');

  const isChartDataValid = () => {
    return (
      graphData.labels.length > 0 &&
      graphData.datasets[0].data.length > 0 &&
      graphData.datasets[0].data.every(val => typeof val === 'number' && isFinite(val))
    );
  };


  useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          if (navigation.canGoBack()) {
            navigation.navigate('utilities')
          } else {
            BackHandler.exitApp();
          }
          return true;
        };
  
        const subscription = BackHandler.addEventListener(
          'hardwareBackPress',
          onBackPress
        );
  
        return () => subscription.remove();
      }, [navigation])
    );
  
    useEffect(() => {
      fetchConsumptionData();
    }, []);
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBackButtonClick} style={styles.backButton}>
        <Image source={leftArrowIcon} style={styles.backIcon} />
      </TouchableOpacity>

      <Text style={styles.title}>Gas Consumption</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <ScrollView style={styles.tableContainer}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Delivered Date</Text>
                <Text style={styles.tableHeaderText}>Weight</Text>
                <Text style={styles.tableHeaderText}>Amount</Text>
              </View>
              {consumptionData.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{new Date(item.delivered_date).toLocaleDateString()}</Text>
                  <Text style={styles.tableCell}>{item.total_weight}</Text>
                  <Text style={styles.tableCell}>{item.amount}</Text>
                </View>
              ))}
              {consumptionData.length === 0 && (
                <Text style={styles.noDataText}>No data available</Text>
              )}
            </View>
          </ScrollView>

          {isChartDataValid() && (
            <View>
              <Text style={styles.subtitle}>Monthly Consumption Days</Text>
              <LineChart
                data={graphData}
                width={screenWidth - 32}
                height={220}
                chartConfig={{
                  backgroundColor: '#FFF',
                  backgroundGradientFrom: '#FFF',
                  backgroundGradientTo: '#FFF',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForLabels: { fontSize: 10 },
                }}
                style={{ marginVertical: 16, borderRadius: 8 }}
                bezier
              />
            </View>
          )}
        </>
      )}

      <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
        <Text style={styles.addButtonText}>Add New Data</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.modalTitle}>Add Gas Consumption</Text>

            <TextInput
              style={styles.input}
              placeholder="Bill Number"
              value={formData.billNumber}
              onChangeText={value => handleInputChange('billNumber', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Consumer Number"
              value={formData.consumerNumber}
              onChangeText={value => handleInputChange('consumerNumber', value)}
            />
            <TouchableOpacity onPress={() => setShowPickerDelivered(true)}>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={styles.inputt}
                  placeholder="Delivered Date"
                  value={formData.deliveredDate}
                  editable={false}
                />
                <Ionicons name="calendar-outline" size={24} color="black" />
              </View>
            </TouchableOpacity>
            {showPickerDelivered && (
              <DateTimePicker
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                value={new Date()}
                onChange={handleDeliveredDateChange}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Total Weight"
              keyboardType="numeric"
              value={formData.totalWeight}
              onChangeText={value => handleInputChange('totalWeight', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={formData.amount}
              onChangeText={value => handleInputChange('amount', value)}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  backButton: { marginBottom: 16 },
  backIcon: { width: 24, height: 24 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  subtitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  tableContainer: { marginTop: 16 },
  table: { backgroundColor: '#FFF', marginBottom: 16 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    paddingVertical: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  tableHeaderText: { fontWeight: 'bold', fontSize: 14, width: '33%', textAlign: 'center' },
  tableRow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 10, justifyContent: 'space-between' },
  tableCell: { fontSize: 14, width: '33%', textAlign: 'center' },
  noDataText: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 16 },
  addButton: { backgroundColor: '#007BFF', paddingVertical: 12, borderRadius: 4, alignItems: 'center', marginTop: 16 },
  addButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  modalContainer: { backgroundColor: '#FFF', borderRadius: 8, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    marginBottom: 16,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 4,
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputt: { flex: 1, fontSize: 14 },
  submitButton: { backgroundColor: '#007BFF', paddingVertical: 12, borderRadius: 4, alignItems: 'center' },
  submitButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  error: { color: 'red', fontSize: 14, textAlign: 'center', marginBottom: 10 },
});

export default GasConsumption;
