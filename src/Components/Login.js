import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import API_BASE_URL from './Config';
import { AuthContext } from './AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/doctor/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account,
          password,
        }), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || '로그인에 실패했습니다.');
        return;
      }

      const data = await response.json();
  
      // 로그 추가: 응답 및 토큰 데이터 로그 출력
      console.log('Login response:', response);
      console.log('Received Tokens:', data);
      
      const { accessToken, refreshToken } = data;

      if (accessToken && refreshToken) {
        // 로그인 성공 시 액세스 토큰과 리프레시 토큰을 저장하고 메인 스크린으로 이동
        login(accessToken, refreshToken);
        navigate('/mainscreen'); 
      } else {
        setError('토큰을 받아오지 못했습니다.');
      }
    } catch (error) {
      setError('서버와의 통신에 실패했습니다.');
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="login-form">
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>아이디</label>
          <input
            type="text"
            placeholder="아이디"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">로그인</button>
        <div className="form-footer">
          <button type="button" className="footer-button">아이디 찾기</button>
          <button type="button" className="footer-button">PW 찾기</button>
        </div>
        <div className="form-footer">
          <button type="button" className="footer-button" onClick={handleSignupClick}>회원가입</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
