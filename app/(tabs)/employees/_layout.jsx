import { Stack } from "expo-router";


export default function EmployeesStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Employees" }} />
      <Stack.Screen name="add" options={{ title: "Add" }} />
    </Stack>
  );
}
