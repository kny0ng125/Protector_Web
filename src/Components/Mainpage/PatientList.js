import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import API_BASE_URL from '../Config';
import PatientItem from './PatientItem'; 
import './PatientList.css';

const PatientList = ({ searchTerm, searchBy, sortBy, sortOrder, showFavorites, page, onNextPage, onPreviousPage, triggerRefresh }) => {
  const { authFetch } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      let requestUrl = '';
      let searchQuery = '';

      // 검색어가 있을 때, 인코딩하여 쿼리 파라미터 생성
      if (searchTerm) {
        const encodedSearchTerm = encodeURIComponent(searchTerm);
        searchQuery = searchBy === 'uuid' ? `&uuid=${encodedSearchTerm}` : `&name=${encodedSearchTerm}`;
      }

      // 정렬 파라미터 구성
      const sortQuery = `${sortBy},${sortOrder}`;

      // 즐겨찾기 보기일 때와 전체 보기일 때 URL 분기
      if (showFavorites) {
        // 즐겨찾기된 환자 목록을 가져오는 API 호출 + 정렬 및 검색 적용
        requestUrl = `${API_BASE_URL}/doctor/patient/favorite?page=${page}&size=5&sort=${sortQuery}${searchQuery}`;
      } else {
        // 전체 환자 목록을 가져오는 API 호출 + 정렬 및 검색 적용
        requestUrl = `${API_BASE_URL}/doctor/patient?page=${page}&size=5&sort=${sortQuery}${searchQuery}`;
      }

      // 요청 URL을 콘솔에 출력
      console.log('Request URL:', requestUrl);

      const response = await authFetch(requestUrl, {
        method: 'GET',
      });

      console.log('Full Response:', response.data);
      setPatients(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [searchTerm, searchBy, sortBy, sortOrder, showFavorites, page, authFetch, triggerRefresh]);

  const toggleFavorite = async (patientId, isFavorite) => {
    try {
        let method = 'POST';
        let url = `${API_BASE_URL}/doctor/patient/favorite`;
        let body = null;

        // 즐겨찾기가 "FAVORITE"일 때 DELETE 요청으로 즐겨찾기 해제
        if (isFavorite) {
            method = 'DELETE';
            url = `${url}/${patientId}`; // DELETE 요청 시 URL에 patientId 추가
        } else {
            // 즐겨찾기가 "NOT_FAVORITE"일 때 POST 요청으로 즐겨찾기 추가
            body = { patientId: patientId }; // body에 long 타입으로 patientId 추가
            console.log('Setting body for POST:', body);
        }

        // 요청 전에 파라미터와 요청 본문을 콘솔에 출력
        console.log('Request URL:', url);
        console.log('Request Method:', method);
        console.log('Request Body:', body ? JSON.stringify(body) : 'No Body');

        const response = await authFetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: method === 'POST' ? JSON.stringify(body) : null, // POST일 때만 body 포함
        });

        // 응답 로그
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);

        if (response.status === 200 || response.status === 201) {
            fetchPatients(); // 즐겨찾기 상태가 변경되었으므로 목록을 다시 불러옴
        } else {
            const errorMessage = response.data ? response.data.message : '알 수 없는 오류가 발생했습니다';
            console.error('즐겨찾기 변경 실패:', errorMessage);
            if (errorMessage) {
                alert(`오류: ${errorMessage}`);
            }
        }
    } catch (error) {
        console.error('즐겨찾기 변경 중 오류 발생:', error);
        if (error.message) {
            alert(`오류: ${error.message}`);
        }
    }
};



  const deletePatient = async (id) => {
    try {
      const response = await authFetch(`${API_BASE_URL}/doctor/patient/${id}`, {
        method: 'DELETE',
      });

      if (response.status === 200 || response.status === 204) {
        setPatients(prevPatients => prevPatients.filter(patient => patient.id !== id));
      } else {
        const errorMessage = response.data ? response.data.message : 'Unknown error occurred';
        console.error('Failed to delete patient', errorMessage);
        if (errorMessage) {
          alert(`Error: ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      if (error.message) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!patients || patients.length === 0) {
    return <p>등록된 환자가 없습니다.</p>;
  }

  return (
    <div className="patient-list">
      {patients.map(patient => (
        <PatientItem
          key={patient.id}
          patient={patient}
          toggleFavorite={toggleFavorite}
          deletePatient={deletePatient}
        />
      ))}
      <div className="pagination">
        {page > 0 && (
          <button onClick={onPreviousPage} className="pagination-arrow">
            &larr;
          </button>
        )}
        <span className="pagination-info">Page {page + 1}</span>
        {page < totalPages - 1 && (
          <button onClick={onNextPage} className="pagination-arrow">
            &rarr;
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientList;
