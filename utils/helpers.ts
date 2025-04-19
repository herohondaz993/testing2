import { Platform } from 'react-native';

// Generate a random ID for entities
export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Format date to readable string
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format time to readable string
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateString);
  }
};

// Check if platform is web
export const isWeb = Platform.OS === 'web';

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Generate a streak message
export const getStreakMessage = (streak: number): string => {
  if (streak === 0) return "Start your streak today!";
  if (streak === 1) return "First day of your streak!";
  if (streak < 7) return `${streak} day streak! Keep it up!`;
  if (streak === 7) return "1 week streak! Amazing!";
  if (streak < 14) return `${streak} day streak! You're on fire!`;
  if (streak === 14) return "2 week streak! Incredible!";
  if (streak < 30) return `${streak} day streak! Unstoppable!`;
  if (streak === 30) return "1 month streak! Legendary!";
  return `${streak} day streak! You're a mental health champion!`;
};