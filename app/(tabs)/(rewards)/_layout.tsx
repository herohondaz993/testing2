import { Stack } from 'expo-router';

export default function RewardsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Rewards',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="redeemed"
        options={{
          title: 'My Vouchers',
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}