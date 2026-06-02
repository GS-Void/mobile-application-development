import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { WelcomeScreen } from '../screens/WelcomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { TelemetryScreen } from '../screens/TelemetryScrees';
import { PatientsScreen } from '../screens/PatientsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Dashboard: undefined;
  Telemetry: { patientId: number };
  Patients: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        {/* Screen 1: Welcome */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />

        {/* Screen 2: Login */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Screen 3: Dashboard */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />

        {/* Screen 4: Telemetry (patient detail) */}
        <Stack.Screen name="Telemetry" component={TelemetryScreen} />

        {/* Screen 5a: Patients list */}
        <Stack.Screen name="Patients" component={PatientsScreen} />

        {/* Screen 5b: Profile */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}