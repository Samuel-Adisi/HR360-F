import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00D9A5',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
      }}>
      <Tabs.Screen
        name="recruiment"
        options={{
          title: 'recruiment',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'time' : 'time-outline'} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />
       <Tabs.Screen
        name="dashboard"
        options={{
          title: 'dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'time' : 'time-outline'} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}