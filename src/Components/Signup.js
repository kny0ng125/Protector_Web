import React, { useState } from 'react';
import './SignUp.css';
import API_BASE_URL from './Config';

const SignUpForm = () => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [accountValid, setAccountValid] = useState(null);
  const [licenseValid, setLicenseValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState(null);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    return regex.test(password);
  };

  const checkAccountAvailability = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctor/check/account?account=${account}`);
      const data = await response.json();
      console.log('Account Check Response:', data); // 응답 데이터 확인
      setAccountValid(data); // 서버가 true/false 값을 반환한다고 가정
    } catch (error) {
      console.error('Error checking account availability:', error);
      setAccountValid(false); // 오류 발생 시 중복으로 판정
    }
  };

  const checkLicenseNumberAvailability = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctor/check/license-number?licenseNumber=${licenseNumber}`);
      const data = await response.json();
      console.log('License Check Response:', data); // 응답 데이터 확인
      setLicenseValid(data); // 서버가 true/false 값을 반환한다고 가정
    } catch (error) {
      console.error('Error checking license number availability:', error);
      setLicenseValid(false); // 오류 발생 시 사용 불가능으로 판정
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!licenseNumber || !account || !password || !confirmPassword || !agree) {
      setError('모든 필드를 채워주시고, 개인정보 이용에 동의해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/doctor/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          licenseNumber,
          account,
          password,
        }),
      });

      if (response.ok) {
        setSuccess('회원가입이 완료되었습니다. 잠시 후 로그인 페이지로 이동합니다.');
        setError('');
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        setError('회원가입에 실패했습니다.');
        setSuccess('');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('서버와의 통신에 실패했습니다.');
      setSuccess('');
    }
  };

  return (
    <div className="sign-up-form">
      <h2>회원 가입</h2>
      <form onSubmit={handleSubmit}>
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
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="agree"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <label htmlFor="agree">개인정보 이용에 동의합니다.</label>
        </div>
        {!agree && (
          <p className="error-message">개인정보 이용에 동의해주셔야 합니다.</p>
        )}
        <button type="submit">가입하기</button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default SignUpForm;
