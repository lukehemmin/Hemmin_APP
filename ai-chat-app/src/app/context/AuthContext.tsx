import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState } from '../../types';
import { supabase } from '../../utils/supabase';
import { getCurrentUser, getSession } from '../../utils/auth';

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // 초기 로드시 세션 확인
    const loadUserSession = async () => {
      try {
        const session = await getSession();
        const user = await getCurrentUser();
        
        setAuthState({
          user,
          session: session.session,
          loading: false,
        });
      } catch (error) {
        setAuthState({
          user: null,
          session: null,
          loading: false,
        });
      }
    };

    loadUserSession();

    // 인증 상태 변경 구독
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const user = await getCurrentUser();
          setAuthState({
            user,
            session,
            loading: false,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            loading: false,
          });
        }
      }
    );

    return () => {
      // 구독 취소
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setAuthState({
      user: null,
      session: null,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, signOut }}>
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