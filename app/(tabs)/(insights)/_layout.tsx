import { Stack } from 'expo-router';

export default function InsightsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Insights',
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}