import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSQLiteContext } from 'expo-sqlite';
import { hashPassword } from '@/utils/hashPassword';

type User = {
  id: number;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, senha: string) => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  register: async () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const db = useSQLiteContext();

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const hashedSenha = await hashPassword(senha);
      const userRecord: User | null = await db.getFirstAsync(
        'SELECT id, email FROM usuarios WHERE email = ? AND senha = ?',
        [email, hashedSenha]
      );

      if (userRecord) {
        setUser(userRecord);
        await AsyncStorage.setItem('user', JSON.stringify(userRecord));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login Error:', error);
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  const register = async (email: string, senha: string): Promise<boolean> => {
    try {
      const hashedSenha = await hashPassword(senha);
      const result = await db.runAsync(
        'INSERT INTO usuarios (email, senha) VALUES (?, ?)',
        [email, hashedSenha]
      );
      if (result.changes && result.changes > 0) {
        return await login(email, senha);
      }
      return false;
    } catch (error) {
      console.error('Register Error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
