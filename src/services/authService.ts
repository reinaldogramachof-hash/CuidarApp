import type { Session } from '@supabase/supabase-js';
import type { UserRole } from '../types/domain';
import { supabase } from './supabaseClient';

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: Exclude<UserRole, 'admin'>;
  phone?: string;
};

export type AuthProfile = {
  id: string;
  name: string;
  role: Exclude<UserRole, 'admin'>;
  phone?: string | null;
  avatar_url?: string | null;
};

export const authService = {
  async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getProfile(userId: string): Promise<AuthProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, role, phone, avatar_url')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data as AuthProfile | null;
  },

  async login(input: LoginInput): Promise<AuthProfile | null> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) throw error;
    if (!data.user) return null;

    return this.getProfile(data.user.id);
  },

  async register(input: RegisterInput): Promise<AuthProfile | null> {
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          name: input.name,
          role: input.role,
          phone: input.phone,
        },
      },
    });

    if (error) throw error;
    if (!data.user) return null;

    return this.getProfile(data.user.id);
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
