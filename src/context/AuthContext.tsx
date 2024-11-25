import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthState, User } from '../types';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface AuthContextType extends AuthState {
  login: (username: string, pin: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, pin: string, category: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const user = Cookies.get('user');
    if (user) {
      setState(prev => ({ ...prev, user: JSON.parse(user), loading: false }));
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (username: string, pin: string) => {
    try {
      // First, authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: `${username}@example.com`,
        password: pin
      });

      if (authError) throw authError;

      // Then get the user data
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (userError) throw userError;
      if (!user) throw new Error('Invalid credentials');

      // Store user in state and cookies
      setState({ user, loading: false, error: null });
      Cookies.set('user', JSON.stringify(user));
      toast.success('Connexion réussie !');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Identifiants invalides');
      setState(prev => ({ ...prev, error: 'Identifiants invalides' }));
    }
  };

  const logout = async () => {
    Cookies.remove('user');
    setState({ user: null, loading: false, error: null });
    toast.success('Déconnexion réussie');
  };

  const register = async (username: string, pin: string, category: string) => {
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `${username}@example.com`,
        password: pin
      });

      if (authError) throw authError;

      // Then create the user profile
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert([{ 
          id: authData.user?.id, // Use the auth user's ID
          username, 
          pin, 
          category,
          role: 'user'
        }])
        .select()
        .single();

      if (userError) throw userError;

      toast.success('Inscription réussie !');
      await login(username, pin);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("L'inscription a échoué. Veuillez réessayer.");
      setState(prev => ({ ...prev, error: "L'inscription a échoué" }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}