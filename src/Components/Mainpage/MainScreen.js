import React, { useState } from 'react';
import PatientList from './PatientList';
import AddPatientModal from './AddPatientModal';
import './MainScreen.css';

const MainScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [showFavorites, setShowFavorites] = useState(false);
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value);
    if (event.target.value !== 'id') {
      setSortOrder('ASC');
    }
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSortOrderChange = () => {
    setSortOrder((prevOrder) => {
      const newOrder = prevOrder === 'ASC' ? 'DESC' : 'ASC';
      return newOrder;
    });
  };

  const toggleShowFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => (prevPage > 0 ? prevPage - 1 : 0));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="main-screen">
      <header className="main-header">
        <button className="add-patient-button" onClick={openModal}>+ 새 환자 추가하기</button>
        <div className="search-container">
          <select className="search-select" value={searchBy} onChange={handleSearchByChange}>
            <option value="name">이름</option>
            <option value="uuid">UUID</option>
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
            <option value="uuid">UUID</option>
            <option value="createdAt">등록 날짜</option>
          </select>
          <button className="sort-order-button" onClick={handleSortOrderChange}>
            {sortOrder === 'ASC' ? '▲' : '▼'}
          </button>
        </div>
        <button className="favorites-button" onClick={toggleShowFavorites}>
          {showFavorites ? '전체 보기' : '즐겨찾기 보기'}
        </button>
      </header>
      <div className="patient-container">
        <PatientList
          searchTerm={searchTerm}
          searchBy={searchBy}
          sortBy={sortBy}
          sortOrder={sortOrder}
          showFavorites={showFavorites}
          page={page}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          triggerRefresh={isModalOpen} // 모달이 열릴 때 데이터를 새로고침
        />
      </div>
      <AddPatientModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddPatient={closeModal} // 환자 추가 후 모달 닫기
      />
    </div>
  );
};

export default MainScreen;
