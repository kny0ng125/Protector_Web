import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import API_BASE_URL from '../Config';
import './HospitalMembers.css';
import HospitalRequestModal from './HospitalRequestModal';

const HospitalMembers = () => {
  const { authFetch } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);

  // 병원 멤버 데이터 가져오기
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await authFetch(
        `${API_BASE_URL}/doctor/hospital/11/member?page=${page}&size=5&sort=${sortBy},${sortOrder}`,
        {
          method: 'GET',
        }
      );
      if (response.status === 200) {
        setMembers(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        console.error('멤버 정보를 가져오는데 실패했습니다:', response);
      }
    } catch (error) {
      console.error('멤버 정보를 가져오는 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  // 병원 멤버 요청 데이터 가져오기
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await authFetch(
        `${API_BASE_URL}/doctor/hospital/member/request/11?page=${page}&size=`,
        {
          method: 'GET',
        }
      );
      if (response.status === 200) {
        setRequests(response.data.content || []);
      } else {
        console.error('요청 정보를 가져오는데 실패했습니다:', response);
      }
    } catch (error) {
      console.error('요청 정보를 가져오는 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [page, sortBy, sortOrder]);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSortOrderChange = () => {
    setSortOrder((prevOrder) => (prevOrder === 'ASC' ? 'DESC' : 'ASC'));
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleOpenModal = async () => {
    await fetchRequests(); // 요청 목록을 가져온 후 모달을 엽니다.
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 멤버 삭제 핸들러
  const handleDelete = async (licenseNumber) => {
    try {
      const response = await authFetch(
        `${API_BASE_URL}/doctor/hospital/member/11/${licenseNumber}`,
        {
          method: 'DELETE',
        }
      );

      if (response.status === 200 || response.status === 204) {
        alert('멤버가 삭제되었습니다.');
        fetchMembers(); // 멤버 목록을 새로고침
      } else {
        console.error('삭제 중 오류 발생:', response);
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('오류가 발생했습니다.');
    }
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="hospital-members">
      <h1>병원 멤버 관리하기</h1>
      <div className="controls">
        <div className="sort-controls">
          <label>정렬 기준: </label>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="name">이름</option>
            <option value="joinedAt">등록 일자</option>
          </select>
          <button onClick={handleSortOrderChange}>
            {sortOrder === 'ASC' ? '▲' : '▼'}
          </button>
        </div>
        <button className="request-button" onClick={handleOpenModal}>
          + 멤버 요청 확인하기
        </button>
      </div>
      <div className="table-container">
        <table className="members-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>연락처</th>
              <th>전공 분야</th>
              <th>승인 책임자</th>
              <th>등록 일자</th>
              <th></th> {/* 삭제 열 추가 */}
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id.number}>
                <td>{member.name}</td>
                <td>{member.phone}</td>
                <td>{member.specialty}</td>
                <td>{member.professionalSummary}</td>
                <td>{new Date(member.joinedAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="action-button"
                    onClick={() => handleDelete(member.id.number)}
                  >
                    ❌
                  </button>
                </td> {/* 삭제 버튼 추가 */}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <span>Page {page + 1}</span>
        </div>
      </div>
      {isModalOpen && <HospitalRequestModal requests={requests} onClose={handleCloseModal} />}
    </div>
  );
};

export default HospitalMembers;
