import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  isLoggedIn: boolean;
}

interface StoredUser {
  email?: string;
  username: string;
  password: string;
  createdAt?: string;
}

interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
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

      // Create new user
      const newUser: StoredUser = {
        username,
        password,
        createdAt: new Date().toISOString()
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
      setUser({ username, isLoggedIn: true });
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
      // Set the current user
      setUser({ username, isLoggedIn: true });
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

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
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