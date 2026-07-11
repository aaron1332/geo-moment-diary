import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

// Import database dan halaman
import { initDatabase } from './src/database/db';
import HomeScreen from './src/screens/HomeScreen';
import InputScreen from './src/screens/InputScreen';
import DetailScreen from './src/screens/DetailScreen';
import EditScreen from './src/screens/EditScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
     
      await initDatabase();
      try {
        await ImagePicker.requestCameraPermissionsAsync();
        await Location.requestForegroundPermissionsAsync();
      } catch (error) {
        console.log('Gagal meminta izin di awal:', error);
      }

      setIsReady(true);
    };
    setup();
  }, []);

 
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FBFA' }}>
        <ActivityIndicator size="large" color="#2E5A44" />
        <Text style={{ marginTop: 12, color: '#6B7280', fontSize: 12 }}>Menyiapkan Geo Moment Diary...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
     <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, 
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Geo Moment Diary' }} />
        <Stack.Screen name="Input" component={InputScreen} options={{ title: 'Catat Perjalanan' }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Detail Momen' }} />
        <Stack.Screen name="Edit" component={EditScreen} options={{ title: 'Edit Momen' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
