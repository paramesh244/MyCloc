import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown:false
      }
        }>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="approvalpending" />
      <Stack.Screen name="homepage" />
      <Stack.Screen name="addgroceries" />
      <Stack.Screen name="gasConsumption" />
      <Stack.Screen name="waterConsumption"/>
      <Stack.Screen name="newspaper"/>
      <Stack.Screen name="warranties"/>
      <Stack.Screen name='reminders'/>
      <Stack.Screen name='addFamily'/>
    </Stack>

  );
}
