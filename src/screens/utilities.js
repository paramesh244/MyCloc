import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
//import { useNavigation } from "@react-navigation/native";
import bulb from "../../assets/images/bulb.png";
import gas from "../../assets/images/gas.png";
import leftArrowIcon from "../../assets/images/leftArrow.png";
import newspaper from "../../assets/images/newspaper.png";
import water from "../../assets/images/water.jpg";
import { useNavigation } from "@react-navigation/native";

export default function Utilities() {
  const navigation = useNavigation();

  const handleBackButtonClick = () => {
    navigation.navigate("homepage");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButtonClick} style={styles.button}>
          <Image source={leftArrowIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Utilities</Text>
      </View>

      {/* Utility Options */}
      <View style={styles.utilitiesContainer}>
        <TouchableOpacity
          style={styles.utilityCard}
          onPress={() => navigation.navigate("electricity")}
        >
          <Text style={styles.utilityTitle}>Electricity</Text>
          <Image source={bulb} style={styles.utilityImage} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.utilityCard}
          onPress={() => navigation.navigate("gas")}
        >
          <Text style={styles.utilityTitle}>Gas</Text>
          <Image source={gas} style={styles.utilityImage} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.utilityCard}
        onPress={() => navigation.navigate("water")}
        >
          <Text style={styles.utilityTitle}>Water</Text>
          <Image source={water} style={styles.utilityImage} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.utilityCard}
         onPress={() => navigation.navigate("newspaper")}
        >
          <Text style={styles.utilityTitle}>Newspaper</Text>
          <Image source={newspaper} style={styles.utilityImage} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    marginRight: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  utilitiesContainer: {
    flexDirection: "column",
    gap: 15,
  },
  utilityCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 15,
  },
  utilityTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  utilityImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
});
