// HospitalRequestModal.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import API_BASE_URL from '../Config';
import './HospitalRequestModal.css'; // 모달 스타일

const HospitalRequestModal = ({ requests, onClose }) => {
  const { authFetch } = useContext(AuthContext);
  const [message, setMessage] = useState(''); // 메시지 상태 관리

  // 수락 버튼 클릭 핸들러
  const handleAccept = async (licenseNumber) => {
    try {
      console.log('Accepting license:', licenseNumber);
      const response = await authFetch(`${API_BASE_URL}/doctor/hospital/11/member/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ licenseNumber }),
      });

      if (response.status === 201) {
        setMessage('요청이 수락되었습니다.');
        // 요청이 완료되었으므로 메시지를 표시하고 필요 시 추가 동작 수행
      } else {
        console.error('수락 중 오류 발생:', response);
        setMessage('수락에 실패했습니다.');
      }
    } catch (error) {
      console.error('수락 중 오류 발생:', error);
      setMessage('오류가 발생했습니다.');
    }
  };

  // 거절 버튼 클릭 핸들러
  const handleDecline = async (licenseNumber) => {
    try {
      console.log('Declining license:', licenseNumber);
      const response = await authFetch(`${API_BASE_URL}/doctor/hospital/11/member/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ licenseNumber }),
      });

      if (response.status === 201) {
        setMessage('요청이 거절되었습니다.');
      } else {
        console.error('거절 중 오류 발생:', response);
        setMessage('거절에 실패했습니다.');
      }
    } catch (error) {
      console.error('거절 중 오류 발생:', error);
      setMessage('오류가 발생했습니다.');
    }
  };

  // `request.doctor`의 속성 로그 출력
  const logDoctorAttributes = (doctor) => {
    console.log('Doctor Attributes:', doctor);
  };

  return (
    <div className="request-modal">
      <div className="modal-content">
        <h2>멤버 등록 요청 목록</h2>
        <button className="close-button" onClick={onClose}>X</button>
        <ul>
          {requests.map((request) => (
            <li key={request.id} className="request-item">
              {/* 로그 출력 */}
              {logDoctorAttributes(request.doctor)}
              <div className="doctor-info">
                <p>{request.doctor.name}</p>
                <p>{request.doctor.phone}</p>
              </div>
              <div className="action-buttons">
                <button className="accept-button" onClick={() => handleAccept(request.doctor.id.number)}>✔️</button>
                <button className="decline-button" onClick={() => handleDecline(request.doctor.id.number)}>❌</button>
              </div>
            </li>
          ))}
        </ul>
        {/* 요청 결과 메시지 표시 */}
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default HospitalRequestModal;
