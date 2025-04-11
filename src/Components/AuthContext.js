import React, { createContext, useState, useCallback, useMemo } from 'react';
import API_BASE_URL from './Config';
import axios from 'axios';
import {useAuthFetch} from './useAuthFetch';

// Auth 인증 상태/ 함수 분리 및 useEffect State만으로 관리되므로 제거거
export const AuthStateContext = createContext();
export const AuthActionsContext = createContext()

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));


  // 04-11. Login, Logout, refreshAccessToken 함수 useCallback 사용해서 메모이제이션 적용용
  const login = useCallback((accessToken, refreshToken) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback((message) => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
  }, []);

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

  const authFetch = useAuthFetch(accessToken, refreshAccessToken, logout);
  //useMemo 사용해서 login,logout, authFetch값 캐싱싱
  const authActions = useMemo(() => ({login, logout, authFetch}), [login, logout, authFetch]);  


  return (
    <AuthStateContext.Provider value={ isAuthenticated }>
      <AuthActionsContext.Provider value = {authActions}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
};

export default AuthProvider;
