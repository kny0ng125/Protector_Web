import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MedicationPage.css';

const MedicationPage = () => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([
    { id: 1, name: '소염 진통제', period: '04.25~04.29', times: '08:00 / 12:00 / 18:00', active: false },
    { id: 2, name: '해열제', period: '04.25~05.01', times: '08:00 / 12:00 / 18:00', active: true },
    { id: 3, name: '스프레이', period: '04.25~05.01', times: '08:00 / 12:00 / 18:00', active: true },
    { id: 4, name: '항생제', period: '04.25~05.01', times: '08:00 / 12:00 / 18:00', active: true }
  ]);

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleSave = () => {
    // Save the changes (implement as needed)
    navigate(-1); // Go back to the previous page after saving
  };

  const handleChange = (id, field, value) => {
    setMedications((prevMedications) =>
      prevMedications.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  const toggleActive = (id) => {
    setMedications((prevMedications) =>
      prevMedications.map((med) =>
        med.id === id ? { ...med, active: !med.active } : med
      )
    );
  };

  return (
    <div className="medication-page">
      <header className="medication-header">
        <h1>복약 및 처방할 치료제 목록</h1>
      </header>
      <button className="add-medication-button">처방 약품 추가</button>
      <table className="medication-table">
        <thead>
          <tr>
            <th>약품명</th>
            <th>복용 기간</th>
            <th>알람 시간</th>
            <th>활성화</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {medications.map((med) => (
            <tr key={med.id}>
              <td>
                <input
                  type="text"
                  value={med.name}
                  onChange={(e) => handleChange(med.id, 'name', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={med.period}
                  onChange={(e) => handleChange(med.id, 'period', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={med.times}
                  onChange={(e) => handleChange(med.id, 'times', e.target.value)}
                />
              </td>
              <td>
                <span
                  className={med.active ? 'active' : 'inactive'}
                  onClick={() => toggleActive(med.id)}
                >
                  {med.active ? '🔔' : '🔕'}
                </span>
              </td>
              <td>
                <button className="delete-button">삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="medication-controls">
        <button className="cancel-button" onClick={handleCancel}>취소하기</button>
        <button className="save-button" onClick={handleSave}>저장하기</button>
      </div>
    </div>
  );
};

export default MedicationPage;
