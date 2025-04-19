import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '@/constants/colors';
import { Home, BookOpen, BarChart2, Gift, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.gray[200],
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.gray[200],
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(journal)"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(insights)"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(rewards)"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color, size }) => <Gift size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}