import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
  BackHandler,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ApiClient } from '../service/api';
import leftArrowIcon from '../../assets/images/leftArrow.png';

const screenWidth = Dimensions.get('window').width;

const WaterConsumption = () => {
  const navigation = useNavigation();
  const api = ApiClient();

  const [isModalVisible, setModalVisible] = useState(false);
  const [showPickerReading, setShowPickerReading] = useState(false);
  const [showPickerDue, setShowPickerDue] = useState(false);
  const [dateReading, setDateReading] = useState(new Date());
  const [dateDue, setDateDue] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [consumptionData, setConsumptionData] = useState([]);

  const [formData, setFormData] = useState({
    readingDate: '',
    dueDate: '',
    consumptionInLtrs: '',
    waterCharges: '',
    otherCharges: '',
    totalAmount: '',
  });

  // ✅ Android hardware back handler
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          BackHandler.exitApp();
        }
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => {
        if (subscription && typeof subscription.remove === 'function') {
          subscription.remove();
        }
      };
    }, [navigation])
  );

  useEffect(() => {
    fetchConsumptionData();
  }, []);

  const fetchConsumptionData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/waterConsumption/last_three_months');
      if (Array.isArray(response.data)) {
        setConsumptionData(response.data);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Could not fetch water consumption data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post('/waterConsumption/addData', {
        readingDate: formData.readingDate,
        dueDate: formData.dueDate,
        consumptionInLtrs: parseFloat(formData.consumptionInLtrs),
        waterCharges: parseFloat(formData.waterCharges),
        otherCharges: parseFloat(formData.otherCharges),
        totalAmount: parseFloat(formData.totalAmount),
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert('Success', 'Data added successfully!');
        setFormData({
          readingDate: '',
          dueDate: '',
          consumptionInLtrs: '',
          waterCharges: '',
          otherCharges: '',
          totalAmount: '',
        });
        toggleModal();
        fetchConsumptionData();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit water consumption data');
    }
  };

  const handleReadingDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateReading;
    setShowPickerReading(false);
    setDateReading(currentDate);
    handleInputChange('readingDate', currentDate.toISOString().split('T')[0]);
  };

  const handleDueDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateDue;
    setShowPickerDue(false);
    setDateDue(currentDate);
    handleInputChange('dueDate', currentDate.toISOString().split('T')[0]);
  };

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleBackButtonClick = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const graphData = {
    labels: consumptionData.map(item =>
      new Date(item.reading_date).toLocaleDateString()
    ),
    datasets: [
      {
        data: consumptionData.map(item => item.consumption_liters),
      },
    ],
  };



  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBackButtonClick} style={styles.backButton}>
        <Image source={leftArrowIcon} style={styles.backIcon} />
      </TouchableOpacity>

      <Text style={styles.title}>Water Consumption</Text>

      <ScrollView>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Reading Date</Text>
            <Text style={styles.tableHeaderText}>Due Date</Text>
            <Text style={styles.tableHeaderText}>Liters</Text>
            <Text style={styles.tableHeaderText}>Total ₹</Text>
          </View>

          {consumptionData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.reading_date}</Text>
              <Text style={styles.tableCell}>{item.due_date}</Text>
              <Text style={styles.tableCell}>{item.consumption_liters}</Text>
              <Text style={styles.tableCell}>₹{item.total_amount}</Text>
            </View>
          ))}

          {!loading && consumptionData.length === 0 && (
            <Text style={styles.noDataText}>No data available</Text>
          )}
        </View>

        {consumptionData.length > 0 && (
          <>
            <Text style={styles.subtitle}>Consumption Trend</Text>
            <LineChart
              data={graphData}
              width={screenWidth - 32}
              height={220}
              yAxisSuffix="L"
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
            />
          </>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
        <Text style={styles.addButtonText}>Add New Data</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.title}>Add Water Data</Text>

          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputt}
              placeholder="Reading Date"
              value={formData.readingDate}
              editable={false}
            />
            <TouchableOpacity onPress={() => setShowPickerReading(true)}>
              <Ionicons name="calendar-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {showPickerReading && (
            <DateTimePicker
              value={dateReading}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={handleReadingDateChange}
            />
          )}

          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputt}
              placeholder="Due Date"
              value={formData.dueDate}
              editable={false}
            />
            <TouchableOpacity onPress={() => setShowPickerDue(true)}>
              <Ionicons name="calendar-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {showPickerDue && (
            <DateTimePicker
              value={dateDue}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={handleDueDateChange}
            />
          )}

          {[
            ['consumptionInLtrs', 'Consumption in Liters'],
            ['waterCharges', 'Water Charges'],
            ['otherCharges', 'Other Charges'],
            ['totalAmount', 'Total Amount'],
          ].map(([key, placeholder]) => (
            <TextInput
              key={key}
              style={styles.input}
              placeholder={placeholder}
              keyboardType="numeric"
              value={formData[key]}
              onChangeText={(value) => handleInputChange(key, value)}
            />
          ))}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>

        </ScrollView>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 ,paddingTop: 60},
  button: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  subtitle: { fontSize: 16, fontWeight: '600', marginTop: 16, color: '#333' },
  table: { backgroundColor: '#FFFFFF', marginBottom: 16 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  tableCell: { flex: 1, fontSize: 14, textAlign: 'center' },
  noDataText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 16,
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
  inputt: { flex: 1, fontSize: 14 },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 16,
    justifyContent: 'space-between',
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
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
  },
});

export default WaterConsumption;
