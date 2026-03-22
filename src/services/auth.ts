import { supabase } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

export const authService = {
  async signIn(email: string, password: string): Promise<ApiResponse<{ email: string }>> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    return {
      data: { email: data.user?.email ?? '' },
      error: null,
    };
  },

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  onAuthStateChange(callback: (isAuthenticated: boolean) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(!!session);
    });
  },
};
