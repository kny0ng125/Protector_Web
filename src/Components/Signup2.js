import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Signup2.css';
import API_BASE_URL from './Config';

const SignUpFormStep2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { licenseNumber, account, password } = location.state || {};
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [email, setEmail] = useState('');
  const [birth, setBirth] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [specialtyOptions, setSpecialtyOptions] = useState([]);
  const [professionalBackground, setProfessionalBackground] = useState('');
  const [gender, setGender] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Specialty 데이터를 가져오는 함수
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/doctor/specialty`, {
          method: 'GET',
        });
        const data = await response.json();
        console.log('Fetched specialties:', data); // 응답 데이터 구조를 확인
        setSpecialtyOptions(data); // Specialty 옵션을 상태로 저장
      } catch (error) {
        console.error('Error fetching specialties:', error);
      }
    };

    fetchSpecialties();
  }, []);

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpecialtyChange = (event) => {
    const selectedDescription = event.target.value;
    const selectedSpecialty = specialtyOptions.find(option => option.description === selectedDescription);
    if (selectedSpecialty) {
      setSpecialty(selectedSpecialty.specialty);
    } else {
      setSpecialty(''); // 기본값으로 설정
    }
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !phone || !email || !birth || !specialty || !gender || !agree) {
      setError('모든 필드를 채워주시고, 개인정보 이용에 동의해주세요.');
      return;
    }

    const doctorSignUpData = {
      licenseNumber,
      account,
      password,
      name,
      phone,
      email,
      birth,
      specialty,
      gender,
      professionalSummary: professionalBackground,
    };

    const formData = new FormData();
    formData.append('doctorSignUp', new Blob([JSON.stringify(doctorSignUpData)], {
      type: 'application/json'
    }));
    
    // profileImage가 없으면 빈 Blob을 추가 (빈 문자열도 가능)
    formData.append('profileImage', profileImage ? profileImage : new Blob([], { type: 'application/octet-stream' }));

    // FormData 객체의 내용을 콘솔에 출력 (필드와 그 내용을 함께)
    for (const [key, value] of formData.entries()) {
        if (value instanceof Blob) {
            value.text().then(text => {
                console.log(`${key}:`, text);
            });
        } else {
            console.log(`${key}:`, value);
        }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/doctor/signup`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccess('회원가입이 완료되었습니다. 잠시 후 로그인 페이지로 이동합니다.');
        setError('');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        const errorData = await response.json();
        setError('회원가입에 실패했습니다.');
        console.error('Server Error:', errorData);
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
          <label>이름</label>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>전화번호</label>
          <input
            type="text"
            placeholder="전화번호"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>이메일</label>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>생년월일</label>
          <input
            type="date"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>전문 분야</label>
          <select 
            value={specialtyOptions.find(option => option.specialty === specialty)?.description || ''}
            onChange={handleSpecialtyChange}
          >
            <option value="">선택하세요</option>
            {specialtyOptions.length > 0 ? (
              specialtyOptions.map((option) => (
                <option key={option.specialty} value={option.description}>
                  {option.description}
                </option>
              ))
            ) : (
              <option disabled>불러오는 중...</option>
            )}
          </select>
        </div>
        <div className="form-group">
          <label>전문 경력</label>
          <textarea
            placeholder="전문 경력"
            value={professionalBackground}
            onChange={(e) => setProfessionalBackground(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>성별</label>
          <div className="gender-selection">
            <label>
              <input
                type="radio"
                value="MALE"
                checked={gender === 'MALE'}
                onChange={handleGenderChange}
              />
              남성
            </label>
            <label>
              <input
                type="radio"
                value="FEMALE"
                checked={gender === 'FEMALE'}
                onChange={handleGenderChange}
              />
              여성
            </label>
          </div>
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
        <button type="submit">가입 완료</button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default SignUpFormStep2;
