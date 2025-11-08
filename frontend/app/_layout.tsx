import React from 'react';
import { Stack } from 'expo-router';
import { LanguageProvider } from '../contexts/LanguageContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#232426',
          },
          headerTintColor: '#FEC11B',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#232426',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="catalog" 
          options={{ 
            title: 'Catalog',
            headerBackTitle: 'Back'
          }} 
        />
        <Stack.Screen 
          name="rate" 
          options={{ 
            title: 'Rate Our Booth',
            headerBackTitle: 'Back'
          }} 
        />
        <Stack.Screen 
          name="faq" 
          options={{ 
            title: 'FAQ',
            headerBackTitle: 'Back'
          }} 
        />
      </Stack>
    </LanguageProvider>
  );
}