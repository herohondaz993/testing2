import { Stack } from 'expo-router';

export default function JournalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Journal',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: 'New Entry',
          headerTitleAlign: 'center',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Journal Entry',
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}