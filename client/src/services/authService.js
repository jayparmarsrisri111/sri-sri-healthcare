/**
 * Authentication & Role-Based Access Control Service
 * Supports 3 Personas: Patient, Doctor, Admin
 * Integrates with Express API + resilient localStorage cache
 */

import axios from 'axios';

const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '0.0.0.0'
);
const remoteApiUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || '';
const API_BASE_URL = remoteApiUrl ? `${remoteApiUrl}/auth` : (isLocalhost ? 'http://localhost:5000/api/auth' : '/api/auth');
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
      const res = await axios.post(`${API_BASE_URL}/login`, { email, password, role }, { timeout: isLocalhost ? 1200 : 1800 });
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
      const res = await axios.post(`${API_BASE_URL}/register`, userData, { timeout: isLocalhost ? 1200 : 1800 });
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
      userId: userData.userId || `USR-${prefix}-${Date.now().toString().slice(-4)}`,
      avatar: role === 'doctor' ? '👨‍⚕️' : role === 'admin' ? '🛡️' : '👨‍🦰',
      badgeLabel: role === 'doctor' ? 'તબીબ (Doctor)' : role === 'admin' ? 'મુખ્ય પ્રશાસક (Admin)' : 'દર્દી (Patient)',
      doctorVerified: role === 'doctor' ? (userData.doctorVerified !== undefined ? userData.doctorVerified : true) : true,
      verificationStatus: role === 'doctor' ? 'verified' : 'active',
      certificateUploadedAt: role === 'doctor' ? new Date().toISOString() : null,
      createdAt: new Date().toISOString()
    };

    // Save to persistent all users list
    try {
      const storedUsersRaw = localStorage.getItem('swasthyasetu_registered_users');
      const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      const updatedList = [newUser, ...storedUsers.filter(u => u.email !== newUser.email)];
      localStorage.setItem('swasthyasetu_registered_users', JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Could not cache registered user:', e);
    }

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
    let baseUsers = Object.values(DEMO_ACCOUNTS);
    try {
      const storedUsersRaw = localStorage.getItem('swasthyasetu_registered_users');
      if (storedUsersRaw) {
        const customUsers = JSON.parse(storedUsersRaw);
        baseUsers = [...customUsers, ...baseUsers.filter(d => !customUsers.some(c => c.email === d.email))];
      }
    } catch (e) {}

    try {
      const res = await axios.get(`${API_BASE_URL}/users`, { timeout: 1500 });
      if (res.data && res.data.success && Array.isArray(res.data.users)) {
        return [...res.data.users, ...baseUsers.filter(b => !res.data.users.some(u => u.email === b.email))];
      }
    } catch (e) {
      // Offline fallback
    }
    return baseUsers;
  },

  // Admin Doctor Certificate Verification
  updateDoctorVerification: (userId, isVerified, notes = '') => {
    try {
      const storedUsersRaw = localStorage.getItem('swasthyasetu_registered_users');
      let storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      let found = false;
      storedUsers = storedUsers.map(u => {
        if (u.userId === userId || u.email === userId) {
          found = true;
          return {
            ...u,
            doctorVerified: isVerified,
            verificationStatus: isVerified ? 'verified' : 'rejected',
            verificationNotes: notes,
            verifiedAt: new Date().toISOString()
          };
        }
        return u;
      });

      if (found) {
        localStorage.setItem('swasthyasetu_registered_users', JSON.stringify(storedUsers));
        // Also update currentUser if it's the same
        const current = authService.getCurrentUser();
        if (current && (current.userId === userId || current.email === userId)) {
          authService.setCurrentUser({ ...current, doctorVerified: isVerified, verificationStatus: isVerified ? 'verified' : 'rejected' });
        }
        window.dispatchEvent(new CustomEvent('auth_user_changed', { detail: null }));
        return true;
      }
    } catch (e) {
      console.error('Error updating doctor verification:', e);
    }
    return false;
  },

  // Admin Dynamic Role Update
  updateUserRole: (userId, newRole) => {
    try {
      const storedUsersRaw = localStorage.getItem('swasthyasetu_registered_users');
      let storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      let found = false;
      storedUsers = storedUsers.map(u => {
        if (u.userId === userId || u.email === userId) {
          found = true;
          return { ...u, role: newRole };
        }
        return u;
      });

      if (!found) {
        // If it was a demo user not yet in storage, add modified clone
        const all = Object.values(DEMO_ACCOUNTS);
        const match = all.find(u => u.userId === userId || u.email === userId);
        if (match) {
          storedUsers.push({ ...match, role: newRole });
          found = true;
        }
      }

      localStorage.setItem('swasthyasetu_registered_users', JSON.stringify(storedUsers));
      const current = authService.getCurrentUser();
      if (current && (current.userId === userId || current.email === userId)) {
        authService.setCurrentUser({ ...current, role: newRole });
      }
      window.dispatchEvent(new CustomEvent('auth_user_changed', { detail: null }));
      return true;
    } catch (e) {
      console.error('Error updating user role:', e);
      return false;
    }
  },

  // Admin Dynamic User Deletion
  deleteUser: (userId) => {
    try {
      const storedUsersRaw = localStorage.getItem('swasthyasetu_registered_users');
      let storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      storedUsers = storedUsers.filter(u => u.userId !== userId && u.email !== userId);
      localStorage.setItem('swasthyasetu_registered_users', JSON.stringify(storedUsers));
      return true;
    } catch (e) {
      console.error('Error deleting user:', e);
      return false;
    }
  }
};
