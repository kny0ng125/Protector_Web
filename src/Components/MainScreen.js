import React, { useState } from 'react';
import PatientList from './PatientList';
import './MainScreen.css';

const MainScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [sortBy, setSortBy] = useState('name');
  const [showFavorites, setShowFavorites] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value);
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const toggleShowFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  return (
    <div className="main-screen">
      <header className="main-header">
        <button className="add-patient-button">+ 새 환자 추가하기</button>
        <div className="search-container">
          <select className="search-select" value={searchBy} onChange={handleSearchByChange}>
            <option value="name">이름</option>
            <option value="id">UUID</option>
          </select>
          <input
            type="text"
            className="search-input"
            placeholder="검색하기..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="sort-container">
          <span className="sort-label">정렬순:</span>
          <select className="sort-select" value={sortBy} onChange={handleSortByChange}>
            <option value="name">이름</option>
            <option value="id">UUID</option>
            <option value="registrationDate">등록 날짜</option>
          </select>
        </div>
        <button className="favorites-button" onClick={toggleShowFavorites}>
          {showFavorites ? '전체 보기' : '즐겨찾기 보기'}
        </button>
      </header>
      <div className="patient-container">
        <PatientList searchTerm={searchTerm} searchBy={searchBy} sortBy={sortBy} showFavorites={showFavorites} />
      </div>
    </div>
  );
};

export default MainScreen;
