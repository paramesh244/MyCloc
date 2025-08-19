import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BarChart } from 'react-native-chart-kit';  // Import BarChart
import { Dimensions } from 'react-native';
import { ApiClient } from '../service/api';
import { useNavigation } from '@react-navigation/native';
import leftArrowIcon from '../../assets/images/leftArrow.png';

const screenWidth = Dimensions.get('window').width;

const Newspaper = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    newspaper_name: '',
    bill_date: '',
    amount: '',
  });
  const [consumptionData, setConsumptionData] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = ApiClient();

  const fetchConsumptionData = async () => {
    try {
      const response = await api.get('/newspaper/last_three_months');
      if (response.status === 200 && response.data) {
        setConsumptionData(response.data.data || []);
      } else {
        console.error('Unexpected response structure:', response);
        Alert.alert('Error', 'Unexpected response from the server.');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      Alert.alert('Error', 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumptionData();
  }, []);

  const handleAddData = async () => {
    try {
      const response = await api.post('/newspaper/add', formData);
      if (response.status === 201) {
        Alert.alert('Success', 'Data added successfully!');
        setFormVisible(false);
        setFormData({ newspaper_name: '', bill_date: '', amount: '' });
        fetchConsumptionData();
      } else {
        throw new Error('Failed to add data');
      }
    } catch (error) {
      console.error('Error adding data:', error);
      Alert.alert('Error', 'Failed to add data.');
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
    setFormData({ ...formData, bill_date: currentDate.toISOString().split('T')[0] });
  };

  const tableHead = ['Newspaper Name', 'Bill Date', 'Amount'];
  const tableData = consumptionData.map((item) => [
    item.newspaper_name,
    new Date(item.bill_date).toLocaleDateString(),
    item.amount,
  ]);

  const graphData = {
    labels: consumptionData.map((item, index) =>
      index % 2 === 0 ? new Date(item.bill_date).toLocaleDateString() : '' // Add spaces for X-axis
    ),
    datasets: [
      {
        data: consumptionData.map((item) => item.amount),
        barThickness: 16, // Adjust the thickness of the bars
      },
    ],
  };

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBackButtonClick} style={styles.button}>
        <Image source={leftArrowIcon} style={styles.backIcon} />
      </TouchableOpacity>

      <Text style={styles.title}>Newspaper</Text>

      {formVisible ? (
        <ScrollView style={styles.formContainer}>
          <Text style={styles.label}>Newspaper Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter newspaper name"
            value={formData.newspaper_name}
            onChangeText={(text) => setFormData({ ...formData, newspaper_name: text })}
          />

          <Text style={styles.label}>Bill Date</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputt}
              placeholder="yyyy-mm-dd"
              value={formData.bill_date}
              editable={false}
            />
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <Ionicons name="calendar-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onDateChange}
            />
          )}

          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={formData.amount}
            onChangeText={(text) => setFormData({ ...formData, amount: text })}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleAddData}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <>
          <ScrollView style={styles.tableContainer}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                {tableHead.map((header, index) => (
                  <Text key={index} style={styles.tableHeaderText}>
                    {header}
                  </Text>
                ))}
              </View>

              {tableData.map((row, index) => (
                <View key={index} style={styles.tableRow}>
                  {row.map((cell, cellIndex) => (
                    <Text key={cellIndex} style={styles.tableCell}>
                      {cell}
                    </Text>
                  ))}
                </View>
              ))}
            </View>

            {!loading && consumptionData.length === 0 && (
              <Text style={styles.noDataText}>No data available</Text>
            )}
          </ScrollView>

          <ScrollView>
            <BarChart
              data={graphData}
              width={screenWidth - 32}
              height={220}
              yAxisLabel="₹"
              yAxisInterval={1} // Space for Y-axis
              chartConfig={{
                backgroundColor: '#F8FAFC',
                backgroundGradientFrom: '#FFF',
                backgroundGradientTo: '#FFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForLabels: {
                  fontSize: 10,
                },
                style: { borderRadius: 8 },
              }}
              style={{
                marginVertical: 16,
                borderRadius: 8,
              }}
            />
            {!loading && consumptionData.length === 0 && (
              <Text style={styles.noDataText}>No data available</Text>
            )}
          </ScrollView>
        </>
      )}

      {!formVisible && (
        <TouchableOpacity style={styles.addButton} onPress={() => setFormVisible(true)}>
          <Text style={styles.addButtonText}>Add New Data</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    marginBottom: 16,
  },
  inputt: {
    flex: 1,
    fontSize: 14,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'space-between', // Align input and icon
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 16,
  },
  tableContainer: {
    marginTop: 16,
  },
  table: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  tableCell: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'left',
  },
});

export default Newspaper;
