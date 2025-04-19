import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '@/types';
import { generateRandomId } from '@/utils/helpers';

interface UserCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends UserCredentials {
  name: string;
}

interface AuthStore extends AuthState {
  isLoading: boolean;
  users: User[];
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; message: string }>;
  login: (credentials: UserCredentials) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  getCurrentUser: () => User | null;
  updateUser: (userId: string, updates: Partial<User>) => void;
}

// Admin credentials
const ADMIN_EMAIL = "admin@mindjournal.com";
const ADMIN_PASSWORD = "admin123";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentUserId: null,
      isAdmin: false,
      isLoading: true,
      users: [],
      
      register: async (credentials: RegisterCredentials) => {
        const { email, password, name } = credentials;
        
        // Check if email already exists
        const existingUser = get().users.find(user => user.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
          return { success: false, message: "Email already registered" };
        }
        
        // Create new user
        const newUser: User = {
          id: generateRandomId(),
          name,
          email,
          points: 0,
          streak: 0,
          lastCheckIn: null,
          joinedAt: new Date().toISOString(),
          isAdmin: false,
        };
        
        // Store password securely (in a real app, this would be hashed)
        const secureUser = { ...newUser, password };
        
        set(state => ({
          users: [...state.users, secureUser],
          isAuthenticated: true,
          currentUserId: newUser.id,
          isAdmin: false,
          isLoading: false
        }));
        
        return { success: true, message: "Registration successful" };
      },
      
      login: async (credentials: UserCredentials) => {
        const { email, password } = credentials;
        
        // Check for admin login
        if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          // If admin doesn't exist yet, create admin account
          const adminExists = get().users.find(user => user.email.toLowerCase() === ADMIN_EMAIL);
          
          if (!adminExists) {
            const adminUser: User = {
              id: "admin-" + generateRandomId(),
              name: "Admin",
              email: ADMIN_EMAIL,
              password: ADMIN_PASSWORD, // In a real app, this would be hashed
              points: 0,
              streak: 0,
              lastCheckIn: null,
              joinedAt: new Date().toISOString(),
              isAdmin: true,
            };
            
            set(state => ({
              users: [...state.users, adminUser],
              isAuthenticated: true,
              currentUserId: adminUser.id,
              isAdmin: true,
              isLoading: false
            }));
          } else {
            set({
              isAuthenticated: true,
              currentUserId: adminExists.id,
              isAdmin: true,
              isLoading: false
            });
          }
          
          return { success: true, message: "Admin login successful" };
        }
        
        // Regular user login
        const user = get().users.find(
          user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
        );
        
        if (!user) {
          return { success: false, message: "Invalid email or password" };
        }
        
        set({
          isAuthenticated: true,
          currentUserId: user.id,
          isAdmin: !!user.isAdmin,
          isLoading: false
        });
        
        return { success: true, message: "Login successful" };
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          currentUserId: null,
          isAdmin: false
        });
      },
      
      getCurrentUser: () => {
        const { currentUserId, users } = get();
        if (!currentUserId) return null;
        
        return users.find(user => user.id === currentUserId) || null;
      },
      
      updateUser: (userId: string, updates: Partial<User>) => {
        set(state => ({
          users: state.users.map(user => 
            user.id === userId ? { ...user, ...updates } : user
          )
        }));
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);