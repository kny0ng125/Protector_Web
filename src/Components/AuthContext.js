import React, { createContext, useState, useEffect } from 'react';
import API_BASE_URL from './Config';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));

  useEffect(() => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }
  }, []);

  const login = (accessToken, refreshToken) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/doctor/logout`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'Cookie': `refresh-token=${refreshToken}`
        }
      });
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/doctor/reissue`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `refresh-token=${refreshToken}`,
        }
      });

      if (response.status === 200) {
        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);
        localStorage.setItem('accessToken', newAccessToken);
        return newAccessToken;
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      logout();
    }
  };

  const authFetch = async (url, options = {}) => {
    if (!options.headers) {
      options.headers = {};
    }

    options.headers['Authorization'] = `Bearer ${accessToken}`;

    try {
      let response = await axios(url, options);

      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          options.headers['Authorization'] = `Bearer ${newToken}`;
          response = await axios(url, options);
        }
      }

      return response;
    } catch (error) {
      console.error('Error in authFetch:', error);
      return error.response;
    }
  };

  // 임시 로그인 상태 변경 함수
  const toggleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, authFetch, toggleAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
