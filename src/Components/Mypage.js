import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Mypage.css';

const Mypage = () => {
  const [userInfo, setUserInfo] = useState({
    licenseNumber: '',
    account: '',
    createdAt: '',
    modifiedAt: ''
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('//mypage');  // API 경로에 맞게 수정
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleEdit = () => {
    // 수정하기 버튼을 클릭했을 때의 로직을 여기에 추가할 수 있습니다.
    // 예: 수정 페이지로 이동 등
    console.log('수정하기 버튼 클릭');
  };

  return (
    <div className="mypage-container">
      <h1>마이페이지</h1>
      <div className="mypage-info">
        <div className="mypage-item">
          <span className="mypage-label">License Number:</span>
          <span className="mypage-value">{userInfo.licenseNumber}</span>
        </div>
        <div className="mypage-item">
          <span className="mypage-label">Account:</span>
          <span className="mypage-value">{userInfo.account}</span>
        </div>
        <div className="mypage-item">
          <span className="mypage-label">Created At:</span>
          <span className="mypage-value">{new Date(userInfo.createdAt).toLocaleString()}</span>
        </div>
        <div className="mypage-item">
          <span className="mypage-label">Modified At:</span>
          <span className="mypage-value">{new Date(userInfo.modifiedAt).toLocaleString()}</span>
        </div>
      </div>
      <button className="edit-button" onClick={handleEdit}>수정하기</button>
    </div>
  );
};

export default Mypage;
