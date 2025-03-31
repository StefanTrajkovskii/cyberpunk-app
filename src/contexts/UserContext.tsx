import React, { createContext, useContext, useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
}

interface User {
  username: string;
  isLoggedIn: boolean;
  currency: number;
  marketProducts?: Product[];
}

interface StoredUser {
  email?: string;
  username: string;
  password: string;
  createdAt?: string;
  currency: number;
  marketProducts?: Product[];
}

interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateCurrency: (newAmount: number) => void;
  updateUserData: (data: Partial<User>) => void;
}

// Define project-specific storage keys
const STORAGE_KEYS = {
  CURRENT_USER: 'cyberpunk_current_user',
  USERS: 'cyberpunk_users'
} as const;

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [user]);

  const register = async (username: string, password: string) => {
    try {
      console.log('Starting registration process for:', username);
      
      // Get existing users from localStorage
      const existingUsersStr = localStorage.getItem(STORAGE_KEYS.USERS);
      console.log('Raw existing users from localStorage:', existingUsersStr);
      
      const users: StoredUser[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];
      console.log('Parsed existing users:', users);
      
      // Check if username already exists
      if (users.some(u => u.username === username)) {
        console.log('Username already exists:', username);
        throw new Error('Username already exists');
      }

      // Create new user with initial currency of 0
      const newUser: StoredUser = {
        username,
        password,
        createdAt: new Date().toISOString(),
        currency: 0,
        marketProducts: [] // Initialize empty products array
      };
      
      // Add to users array
      users.push(newUser);
      
      // Save to localStorage
      const usersStr = JSON.stringify(users);
      console.log('Saving users to localStorage:', usersStr);
      localStorage.setItem(STORAGE_KEYS.USERS, usersStr);
      
      // Verify the save
      const savedUsersStr = localStorage.getItem(STORAGE_KEYS.USERS);
      console.log('Verifying saved users:', savedUsersStr);
      
      if (!savedUsersStr) {
        throw new Error('Failed to save user data');
      }
      
      // Log the user in after successful registration
      setUser({ username, isLoggedIn: true, currency: 0, marketProducts: [] });
      console.log('Registration successful and user logged in');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      console.log('Starting login process for:', username);
      
      // Get users from localStorage
      const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
      console.log('Raw users from localStorage:', usersStr);
      
      const users: StoredUser[] = usersStr ? JSON.parse(usersStr) : [];
      console.log('Parsed users:', users);
      
      // Find user by username
      const foundUser = users.find(u => u.username === username);
      
      // Check if user exists
      if (!foundUser) {
        console.log('User not found in storage:', username);
        throw new Error('User not found');
      }
      
      // Check if password matches
      if (foundUser.password !== password) {
        console.log('Password mismatch for user:', username);
        throw new Error('Invalid password');
      }

      console.log('Login successful for user:', username);
      // Set the current user with their currency and market products
      setUser({ 
        username, 
        isLoggedIn: true, 
        currency: foundUser.currency,
        marketProducts: foundUser.marketProducts || []
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out user:', user?.username);
    // Only clear the current user session, not the stored user data
    setUser(null);
    // Remove only the currentUser from localStorage
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  const updateCurrency = (newAmount: number) => {
    if (!user) return;

    // Update the current user's currency
    setUser({ ...user, currency: newAmount });

    // Update the stored user's currency in the users array
    const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
    if (usersStr) {
      const users: StoredUser[] = JSON.parse(usersStr);
      const updatedUsers = users.map(u => 
        u.username === user.username ? { ...u, currency: newAmount } : u
      );
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    }
  };

  const updateUserData = (data: Partial<User>) => {
    if (!user) return;

    // Update the current user's data
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);

    // Update the stored user's data in the users array
    const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
    if (usersStr) {
      const users: StoredUser[] = JSON.parse(usersStr);
      const updatedUsers = users.map(u => 
        u.username === user.username ? { ...u, ...data } : u
      );
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    }
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout, updateCurrency, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext; 