import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import Login from "../screens/auth/Login";
import Utilities from "../screens/utilities";
import GasConsumption from "../screens/utils/gasConsumption";
import EnergyConsumption from "../screens/utils/electricity";
import AddFamilyPage from "../screens/addFamily";
import AddGroceries from "../screens/addgroceries";
import ApprovalPending from "../screens/approvalpending";
import OutOfStockGroceries from "../screens/getgroceries";
import AddHousehelp from "../screens/househelp";
import HousehelpDetailsPage from "../screens/househelpdetailpage";
import HouseholdManagement from "../screens/householdmanagement";
import Newspaper from "../screens/newspaper";
import Register from "../screens/register";
import Reminders from "../screens/reminders";
import ServiceCenter from "../screens/servicecenter";
import Warranty from "../screens/warranties";
import WaterConsumption from "../screens/waterConsumption";






const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen
          name="login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="homepage" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="utilities" component={Utilities} options={{ headerShown: false }}/>
        <Stack.Screen name="addgroceries" component={AddGroceries} options={{ headerShown: false }}/>
        <Stack.Screen name="approvalpending" component={ApprovalPending} options={{ headerShown: false }} />
        <Stack.Screen name="gas" component={GasConsumption} options={{ headerShown: false }}/>
        <Stack.Screen name="electricity" component={EnergyConsumption} options={{ headerShown: false }}/>
        <Stack.Screen name="register" component={Register} options={{ headerShown: false }}/>
        <Stack.Screen name="water" component={WaterConsumption} options={{ headerShown: false }}/>
        <Stack.Screen name="newspaper" component={Newspaper} options={{ headerShown: false }}/>
        <Stack.Screen name="warranties" component={Warranty} options={{ headerShown: false }}/>
        <Stack.Screen name='reminders' component={Reminders} options={{ headerShown: false }}/>
        <Stack.Screen name='addFamily' component={AddFamilyPage} options={{ headerShown: false }}/>
        <Stack.Screen name='getgroceries' component={OutOfStockGroceries} options={{ headerShown: false }}/>
        <Stack.Screen name='householdmanagement' component={HouseholdManagement} options={{ headerShown: false }}/>
        <Stack.Screen name='househelp' component={AddHousehelp} options={{ headerShown: false }}/>
        <Stack.Screen name='househelpdetails' component={HousehelpDetailsPage} options={{ headerShown: false }}/>
        <Stack.Screen name='servicecenter' component={ServiceCenter} options={{ headerShown: false }}/>
        <Stack.Screen name='outofstockgroceries' component={OutOfStockGroceries} options={{ headerShown: false }}/>
       

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
