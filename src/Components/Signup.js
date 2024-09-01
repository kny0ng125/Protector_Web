import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import API_BASE_URL from './Config';

const SignUpFormStep1 = () => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountValid, setAccountValid] = useState(null);
  const [licenseValid, setLicenseValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState(null);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    return regex.test(password);
  };

  const checkAccountAvailability = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctor/check/account?account=${account}`);
      const data = await response.json();
      setAccountValid(data);
    } catch (error) {
      console.error('Error checking account availability:', error);
      setAccountValid(false);
    }
  };

  const checkLicenseNumberAvailability = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctor/check/license-number?licenseNumber=${licenseNumber}`);
      const data = await response.json();
      setLicenseValid(data);
    } catch (error) {
      console.error('Error checking license number availability:', error);
      setLicenseValid(false);
    }
  };

  const handleNext = (event) => {
    event.preventDefault();

    if (!licenseNumber || !account || !password || !confirmPassword) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!passwordValid) {
      alert('유효한 비밀번호를 입력하세요.');
      return;
    }

    // 모든 정보가 유효하다면 2차 정보 입력 페이지로 이동
    navigate('/signup-step2', { 
      state: { 
        licenseNumber, 
        account, 
        password 
      } 
    });
  };

  return (
    <div className="sign-up-form">
      <h2>회원 가입</h2>
      <form onSubmit={handleNext}>
        <div className="form-group">
          <label>아이디</label>
          <div className="input-container">
            <input
              type="text"
              placeholder="아이디"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            />
            <button type="button" onClick={checkAccountAvailability}>중복 확인</button>
          </div>
          {accountValid === null ? null : accountValid ? (
            <p className="success-message">✔ 사용할 수 있는 아이디입니다.</p>
          ) : (
            <p className="error-message">✖ 이미 사용 중인 아이디입니다.</p>
          )}
        </div>
        <div className="form-group">
          <label>의사 면허 번호</label>
          <div className="input-container">
            <input
              type="text"
              placeholder="의사 면허 번호"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
            />
            <button type="button" onClick={checkLicenseNumberAvailability}>인증하기</button>
          </div>
          {licenseValid === null ? null : licenseValid ? (
            <p className="success-message">✔ 사용 가능한 번호입니다. </p>
          ) : (
            <p className="error-message">✖ 이미 사용 중인 번호입니다. </p>
          )}
        </div>
        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordValid(validatePassword(e.target.value));
            }}
          />
          {password && (
            <p className={passwordValid ? "success-message" : "error-message"}>
              {passwordValid
                ? "✔ 비밀번호가 유효합니다."
                : "✖ 비밀번호는 8~12자여야 하며, 특수문자 및 영어 대소문자를 모두 포함해야 합니다."}
            </p>
          )}
        </div>
        <div className="form-group">
          <label>비밀번호 확인하기</label>
          <input
            type="password"
            placeholder="비밀번호 확인하기"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="error-message">✖ 비밀번호가 일치하지 않습니다.</p>
          )}
        </div>
        <button type="submit">다음 단계</button>
      </form>
    </div>
  );
};

export default SignUpFormStep1;
