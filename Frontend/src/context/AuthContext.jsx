import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      return {
        ...parsedUser,
        _id: parsedUser._id || parsedUser.id,
        id: parsedUser.id || parsedUser._id
      };
    }
    return null;
  });
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return savedToken && savedToken !== 'undefined' ? savedToken : null;
  });

  // Listen to global logout events from axios interceptor
  useEffect(() => {
    const handleLogoutEvent = () => {
      logout();
    };
    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, []);

  const loginUser = (newToken, newUser) => {
    const normalizedUser = {
      ...newUser,
      _id: newUser?._id || newUser?.id,
      id: newUser?.id || newUser?._id
    };
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    setToken(newToken);
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login: loginUser, logout, isAuthenticated: !!token, isAdmin: user?.role === 'Admin', isAbwaan: user?.role === 'Abwaan' }}>
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
