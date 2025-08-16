import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { ApiClient } from "./api";
import leftArrowIcon from '../assets/images/leftArrow.png';

const EnergyConsumption = () => {
  const api = ApiClient();
  const navigation = useNavigation();

  const [consumptionData, setConsumptionData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showReadingDatePicker, setShowReadingDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [newEnergyData, setNewEnergyData] = useState({
    readingDate: "",
    consumptionDetails: { unitsConsumed: "" },
    BillDueDate: "",
  });

  useEffect(() => {
    fetchConsumptionData();
  }, []);

  const fetchConsumptionData = async () => {
    try {
      const response = await api.get("/get_last_three_months");
      setConsumptionData(response.data);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to load data.");
    }
  };

  const handleInputChange = (name, value) => {
    const keys = name.split(".");
    setNewEnergyData((prev) =>
      keys.length > 1
        ? { ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: value } }
        : { ...prev, [name]: value }
    );
  };

  const handleDateChange = (event, date, fieldName) => {
    setShowReadingDatePicker(false);
    setShowDueDatePicker(false);
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      handleInputChange(fieldName, formattedDate);
    }
  };

  const handleAddData = async () => {
    try {
      await api.post("/energyConsumption/addData", newEnergyData);
      Alert.alert("Success", "Data added successfully!");
      fetchConsumptionData();
      setShowForm(false);
      setNewEnergyData({
        readingDate: "",
        consumptionDetails: { unitsConsumed: "" },
        BillDueDate: "",
      });
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "Failed to add data.");
    }
  };
 const handleBackButtonClick = () => {
    navigation.navigate('utilities');
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
    <TouchableOpacity onPress={handleBackButtonClick} style={styles.backButton}>
            <Image source={leftArrowIcon} style={styles.backIcon} />
          </TouchableOpacity>
    
    
        <Text style={styles.title}>Energy Consumption (Last 3 Months)</Text>
  

      {/* Table Display */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.cellHeader}>Reading Date</Text>
          <Text style={styles.cellHeader}>Units</Text>
          <Text style={styles.cellHeader}>Due Date</Text>
        </View>
        {consumptionData.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.cell}>
              {new Date(item.readingDate).toLocaleDateString("en-GB")}
            </Text>
            <Text style={styles.cell}>{item.consumptionDetails.unitsConsumed}</Text>
            <Text style={styles.cell}>{item.BillDueDate}</Text>
          </View>
        ))}
      </View>

      {/* Toggle Form */}
      <TouchableOpacity style={styles.toggleButton} onPress={() => setShowForm(!showForm)}>
        <Text style={styles.toggleButtonText}>
          {showForm ? "Cancel" : "Add Energy Data"}
        </Text>
      </TouchableOpacity>

      {/* Form */}
      {showForm && (
        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Reading Date</Text>
              <TouchableOpacity onPress={() => setShowReadingDatePicker(true)}>
                <TextInput
                  style={styles.input}
                  value={newEnergyData.readingDate}
                  placeholder="yyyy-mm-dd"
                  editable={false}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Due Date</Text>
              <TouchableOpacity onPress={() => setShowDueDatePicker(true)}>
                <TextInput
                  style={styles.input}
                  value={newEnergyData.BillDueDate}
                  placeholder="yyyy-mm-dd"
                  editable={false}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Units Consumed</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Units"
            keyboardType="numeric"
            value={newEnergyData.consumptionDetails.unitsConsumed}
            onChangeText={(value) =>
              handleInputChange("consumptionDetails.unitsConsumed", value)
            }
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleAddData}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Date Pickers */}
      {showReadingDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateChange(event, date, "readingDate")}
        />
      )}
      {showDueDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateChange(event, date, "BillDueDate")}
        />
      )}

      {/* Bar Chart */}
      <Text style={styles.chartTitle}>Monthly Energy Units</Text>
      <BarChart
        data={{
          labels: consumptionData.map((item) => {
            const d = new Date(item.readingDate);
            return `${d.getDate()}-${d.getMonth() + 1}`;
          }),
          datasets: [
            {
              data: consumptionData.map((item) =>
                parseInt(item.consumptionDetails.unitsConsumed)
              ),
            },
          ],
        }}
        width={Dimensions.get("window").width - 40}
        height={300}
        yAxisSuffix="u"
        chartConfig={{
          backgroundGradientFrom: "#4a90e2",
          backgroundGradientTo: "#003f8a",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
          labelColor: () => "#fff",
          style: { borderRadius: 16 },
        }}
        style={styles.chart}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  back: {
    fontSize: 26,
    color: "#007bff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
    color: "#333",
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    padding: 8,
  },
  cellHeader: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  toggleButton: {
    backgroundColor: "#666",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  form: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  field: {
    flex: 0.48,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    backgroundColor: "#f0f0f0",
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  chart: {
    borderRadius: 16,
  },

  backButton: { marginBottom: 16 },
  backIcon: { width: 24, height: 24 },
});

export default EnergyConsumption;
