import { mockCaregiverUser, mockFamilyUser } from '../data/mockCareData';
import type { User, UserRole } from '../types/domain';

export type LoginInput = {
  email: string;
  password: string;
  role?: UserRole;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
};

const wait = async <T>(data: T): Promise<T> =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve(data), 120);
  });

const createId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

export const authService = {
  async getCurrentUser(): Promise<User> {
    return wait(mockFamilyUser);
  },

  async login(input: LoginInput): Promise<User> {
    if (input.role === 'caregiver') {
      return wait(mockCaregiverUser);
    }

    return wait(mockFamilyUser);
  },

  async register(input: RegisterInput): Promise<User> {
    return wait({
      id: createId(input.role),
      name: input.name,
      email: input.email,
      role: input.role,
      phone: input.phone,
      createdAt: new Date().toISOString(),
    });
  },

  async logout(): Promise<void> {
    return wait(undefined);
  },
};
