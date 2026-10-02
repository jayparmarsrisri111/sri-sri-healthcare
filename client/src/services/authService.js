/**
 * Authentication & Role-Based Access Control Service
 * Supports 3 Personas: Patient, Doctor, Admin
 * Integrates with Express API + resilient localStorage cache
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/auth';
const AUTH_STORAGE_KEY = 'swasthyasetu_auth_user';

export const DEMO_ACCOUNTS = {
  patient: {
    userId: 'USR-PAT-001',
    name: 'રામજીભાઈ પટેલ (Ramjibhai Patel)',
    email: 'patient@swasthyasetu.ai',
    password: 'patient123',
    role: 'patient',
    phone: '9876543210',
    age: 48,
    gender: 'Male',
    village: 'ભુજ ગ્રામીણ (Bhuj Rural)',
    district: 'કચ્છ (Kutch)',
    bloodGroup: 'B+',
    emergencyContact: '108',
    avatar: '👨‍🦰',
    badgeLabel: 'દર્દી (Patient)'
  },
  doctor: {
    userId: 'USR-DOC-002',
    name: 'Dr. રાજેશ મહેતા, MD (Dr. Rajesh Mehta)',
    email: 'doctor@swasthyasetu.ai',
    password: 'doctor123',
    role: 'doctor',
    phone: '9825012345',
    specialization: 'મુખ્ય જનરલ ફિઝિશિયન & કાર્ડિયોલોજિસ્ટ',
    regNumber: 'GMC-GUJ-2014-9842',
    hospitalAffiliation: 'GK જનરલ સિવિલ હોસ્પિટલ, ભુજ',
    avatar: '👨‍⚕️',
    badgeLabel: 'તબીબ (Doctor)'
  },
  admin: {
    userId: 'USR-ADM-003',
    name: 'શ્રી કે. પી. જોશી (District Chief Health Officer)',
    email: 'admin@swasthyasetu.ai',
    password: 'admin123',
    role: 'admin',
    phone: '9426098765',
    adminBadge: 'DISTRICT-HEALTH-DIRECTOR-KUTCH',
    department: 'ગુજરાત જાહેર આરોગ્ય વિભાગ (Govt of Gujarat)',
    avatar: '🛡️',
    badgeLabel: 'મુખ્ય પ્રશાસક (Admin)'
  }
};

export const authService = {
  // Get currently logged-in user from storage (defaults to demo patient if none set)
  getCurrentUser: () => {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // Default to Ramjibhai Patel demo patient
      const defaultUser = DEMO_ACCOUNTS.patient;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    } catch (e) {
      console.warn('Error reading auth user:', e);
      return DEMO_ACCOUNTS.patient;
    }
  },

  // Save user session
  setCurrentUser: (user) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('auth_user_changed', { detail: user }));
    } catch (e) {
      console.error('Error saving auth user:', e);
    }
  },

  // Login via API with graceful local fallback
  login: async (email, password, role) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, { email, password, role }, { timeout: 4000 });
      if (res.data && res.data.success) {
        const user = res.data.user;
        user.avatar = user.role === 'doctor' ? '👨‍⚕️' : user.role === 'admin' ? '🛡️' : '👨‍🦰';
        user.badgeLabel = user.role === 'doctor' ? 'તબીબ (Doctor)' : user.role === 'admin' ? 'મુખ્ય પ્રશાસક (Admin)' : 'દર્દી (Patient)';
        authService.setCurrentUser(user);
        return { success: true, user, message: res.data.message };
      }
    } catch (apiErr) {
      console.warn('Backend auth unreachable, checking offline demo accounts:', apiErr.message);
    }

    // Offline matching for demo accounts
    const match = Object.values(DEMO_ACCOUNTS).find(
      acc => acc.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (match) {
      if (match.password === password) {
        if (role && match.role !== role) {
          return { success: false, message: `આ એકાઉન્ટ ${match.role.toUpperCase()} છે, ${role.toUpperCase()} નથી.` };
        }
        authService.setCurrentUser(match);
        return { success: true, user: match, message: `સ્વાગત છે, ${match.name}!` };
      }
      return { success: false, message: 'પાસવર્ડ ખોટો છે.' };
    }

    return { success: false, message: 'ઇમેઇલ અથવા પાસવર્ડ અમાન્ય છે.' };
  },

  // Quick 1-click Demo Login
  loginAsDemo: (role) => {
    const demo = DEMO_ACCOUNTS[role] || DEMO_ACCOUNTS.patient;
    authService.setCurrentUser(demo);
    return demo;
  },

  // Register new user via API with offline fallback
  register: async (userData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/register`, userData, { timeout: 4000 });
      if (res.data && res.data.success) {
        const user = res.data.user;
        user.avatar = user.role === 'doctor' ? '👨‍⚕️' : user.role === 'admin' ? '🛡️' : '👨‍🦰';
        user.badgeLabel = user.role === 'doctor' ? 'તબીબ (Doctor)' : user.role === 'admin' ? 'મુખ્ય પ્રશાસક (Admin)' : 'દર્દી (Patient)';
        authService.setCurrentUser(user);
        return { success: true, user, message: res.data.message };
      }
    } catch (apiErr) {
      console.warn('Backend register error, using offline store:', apiErr.message);
    }

    // Offline registration fallback
    const role = userData.role || 'patient';
    const prefix = role === 'doctor' ? 'DOC' : role === 'admin' ? 'ADM' : 'PAT';
    const newUser = {
      ...userData,
      userId: `USR-${prefix}-${Date.now().toString().slice(-4)}`,
      avatar: role === 'doctor' ? '👨‍⚕️' : role === 'admin' ? '🛡️' : '👨‍🦰',
      badgeLabel: role === 'doctor' ? 'તબીબ (Doctor)' : role === 'admin' ? 'મુખ્ય પ્રશાસક (Admin)' : 'દર્દી (Patient)',
      createdAt: new Date()
    };
    authService.setCurrentUser(newUser);
    return { success: true, user: newUser, message: `સ્વાગત છે ${newUser.name}! એકાઉન્ટ તૈયાર છે.` };
  },

  // Logout
  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('auth_user_changed', { detail: null }));
  },

  // Fetch all users (for Admin & Doctor directories)
  getAllUsers: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users`, { timeout: 4000 });
      if (res.data && res.data.success) {
        return res.data.users;
      }
    } catch (e) {
      console.warn('Could not fetch remote users, returning fallback list');
    }
    return Object.values(DEMO_ACCOUNTS);
  }
};
