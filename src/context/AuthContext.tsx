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
    // Check for existing session on mount
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setState({ user, loading: false, error: null });
      } else {
        setState({ user: null, loading: false, error: null });
      }
    } catch (error) {
      console.error('Session check error:', error);
      setState({ user: null, loading: false, error: 'Session check failed' });
    }
  };

  const login = async (username: string, pin: string) => {
    try {
      const securePassword = `${pin}${pin}${pin}`;

      const { data: { user: authUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email: `${username}@example.com`,
        password: securePassword
      });

      if (signInError) throw signInError;

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (userError) throw userError;

      setState({ user, loading: false, error: null });
      toast.success('Connexion réussie !');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message?.includes('Too Many Requests')) {
        toast.error('Veuillez patienter quelques secondes avant de réessayer');
      } else {
        toast.error('Identifiants invalides');
      }
      setState(prev => ({ ...prev, error: 'Identifiants invalides' }));
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setState({ user: null, loading: false, error: null });
    toast.success('Déconnexion réussie');
  };

  const register = async (username: string, pin: string, category: string) => {
    try {
      const securePassword = `${pin}${pin}${pin}`;

      // Create user in the database first
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert([{ 
          username, 
          pin, 
          category,
          role: 'user'
        }])
        .select()
        .single();

      if (userError) throw userError;

      // Then create auth user and sign in
      const { data: { session }, error: authError } = await supabase.auth.signUp({
        email: `${username}@example.com`,
        password: securePassword,
        options: {
          data: {
            id: user.id,
            username,
            category
          }
        }
      });

      if (authError) {
        // Rollback user creation if auth fails
        await supabase
          .from('users')
          .delete()
          .eq('id', user.id);
        throw authError;
      }

      if (!session) {
        throw new Error('No session created');
      }

      setState({ user, loading: false, error: null });
      toast.success('Inscription réussie !');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message?.includes('Too Many Requests')) {
        toast.error('Veuillez patienter quelques secondes avant de réessayer');
      } else {
        toast.error("L'inscription a échoué. Veuillez réessayer.");
      }
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