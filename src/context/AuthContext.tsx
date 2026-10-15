import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string, role?: UserRole) => Promise<void>;
  register: (studentData: any) => Promise<void>;
  forgotPassword: (identifier: string, newPassword?: string) => Promise<{ message: string; userFound?: any }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  switchDemoUser: (targetRole: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_STUDENT: User = {
  id: 'std-1',
  name: 'Arun Kumar',
  email: 'arun.it@college.edu',
  role: 'student',
  registerNumber: '21IT045',
  department: 'Information Technology',
  year: 'III Year',
  semester: 5,
  section: 'A',
  cgpa: 8.74,
  phone: '+91 98765 43210',
  dob: '2004-06-14',
  address: 'Room 302, Cauvery Men\'s Hostel, College Campus',
  avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces'
};

const DEMO_ADMIN: User = {
  id: 'adm-1',
  name: 'Dr. K. Ramanathan',
  email: 'admin@college.edu',
  role: 'admin',
  department: 'Department of Information Technology',
  year: 'Faculty & HOD',
  phone: '+91 94432 10987',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('apex_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_STUDENT;
      }
    }
    // Default to demo student for instantaneous experience
    return DEMO_STUDENT;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('apex_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('apex_user');
    }
  }, [user]);

  const login = async (identifier: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    try {
      const data = await api.login(identifier, password, role);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (studentData: any) => {
    setIsLoading(true);
    try {
      const data = await api.register(studentData);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (identifier: string, newPassword?: string) => {
    return await api.forgotPassword(identifier, newPassword);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('apex_user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    try {
      const res = await api.updateProfile({ userId: user.id, ...data });
      setUser(res.user);
    } catch (e) {
      // optimistic fallback update
      setUser({ ...user, ...data });
    }
  };

  const switchDemoUser = async (targetRole: UserRole) => {
    if (targetRole === 'admin') {
      setUser(DEMO_ADMIN);
    } else {
      setUser(DEMO_STUDENT);
    }
  };

  const role = user?.role || 'student';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        register,
        forgotPassword,
        logout,
        updateProfile,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
