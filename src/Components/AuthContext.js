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

  const logout = (message) => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/doctor/reissue`, {
        refreshToken: refreshToken
      }, {
        headers: {
          'Content-Type': 'application/json',
          'cookie': `refresh-token=${refreshToken}`
        },
        withCredentials: true, // 쿠키 전송을 위해 withCredentials 설정
      });

      if (response.status === 201) {
        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        // 갱신된 토큰들을 설정
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        return newAccessToken;
      } else {
        logout('세션이 만료되어 로그아웃되었습니다. 다시 로그인해주세요.'); // 로그아웃 및 알림
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      logout('세션이 만료되어 로그아웃되었습니다. 다시 로그인해주세요.'); // 오류 발생 시 로그아웃 및 알림
    }
    return null;
  };

  const authFetch = async (url, options = {}) => {
    // 헤더 설정 확인 및 초기화
    if (!options.headers) {
        options.headers = {};
    }

    // 토큰 설정
    options.headers['Authorization'] = `Bearer ${accessToken}`;

    // POST 요청의 경우 data 설정 확인
    if (options.method && options.method.toUpperCase() === 'POST') {
        if (options.body) {
            options.data = JSON.parse(options.body);  // JSON으로 변환
            delete options.body;  // body 속성 삭제
        }

        // Content-Type 헤더가 설정되어 있는지 확인하고 올바르게 설정
        if (!options.headers['Content-Type']) {
            options.headers['Content-Type'] = 'application/json';
        }
    }

    try {
        let response = await axios(url, options);

        // 유효하지 않은 토큰 처리
        if (response.status === 400 || response.data?.message === '유효하지 않은 토큰입니다.') {
            const newToken = await refreshAccessToken();
            if (newToken) {
                options.headers['Authorization'] = `Bearer ${newToken}`;
                response = await axios(url, options);
            } else {
                logout('세션이 만료되어 로그아웃되었습니다. 다시 로그인해주세요.');
            }
        }

        return response;
    } catch (error) {
        console.error('Error in authFetch:', error);
        return error.response;
    }
};



  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
