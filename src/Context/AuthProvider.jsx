import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../Api/Axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedAuth = localStorage.getItem('isAuthenticated');

      if (storedUser && storedAuth === 'true') {
        const parsedUser = JSON.parse(storedUser);
        
        // Check if stored user is blocked
        if (parsedUser.blocked === true) {
          logout();
          setError('Your account has been blocked. Please contact support.');
          return;
        }
        
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError('');
  };

  const login = async (email, password) => {
    setLoading(true);
    setError('');
  
    try {
      const response = await api.get('/users');
      const users = response.data;
    
      const user = users.find(u => u.email === email && u.password === password);
    
      if (user) {
        // Check if user is blocked
        if (user.blocked === true) {
          setError('Your account has been blocked. Please contact support.');
          return { 
            success: false, 
            blocked: true
          };
        }
        
        const { password: _, ...userWithoutPassword } = user;
      
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', user.role || 'user');
      
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
      
        return { 
          success: true, 
          user: userWithoutPassword,
          isAdmin: user.role === 'admin'
        };
      } else {
        setError('Invalid email or password');
        return { success: false };
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/users');
      const users = response.data;

      const existingUser = users.find(user => user.email === userData.email);

      if (existingUser) {
        setError('User with this email already exists');
        return { success: false, message: 'User with this email already exists' };
      }

      const newUser = {
        id: Date.now().toString(),
        Fname: userData.Fname,
        Lname: userData.Lname,
        email: userData.email,
        password: userData.password,
        blocked: false,
        role: 'user'
      };

      await api.post('/users', newUser);

      return {
        success: true,
        message: 'Account created successfully! Please login to continue.'
      };

    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    setUser(null);
    setIsAuthenticated(false);
    setError('');
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;