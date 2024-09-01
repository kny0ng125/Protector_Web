import React, { createContext, useState } from 'react';

export const HistoryContext = createContext();

const HistoryProvider = ({ children }) => {
  const [historyItems, setHistoryItems] = useState([
    {
      id: 1,
      date: '2024.03.16',
      description: '정재욱 환자(비염 및 축농증)',
      code: '#22345X',
      lastModified: '2024.03.17',
      content: '차도가 어느 정도 있으나, 꾸준히 항생제 복용 필요.'
    },
    {
      id: 2,
      date: '2024.03.11',
      description: '정재욱 환자(비염 및 축농증)',
      code: '#22345X',
      lastModified: '2024.03.13',
      content: '증상 호전 중, 추가 치료 필요 없음.'
    },
    {
      id: 3,
      date: '2024.02.24',
      description: '정재욱 환자(인플루엔자)',
      code: '#14233K',
      lastModified: '2024.03.13',
      content: '인플루엔자 완치, 예방 접종 필요.'
    }
  ]);

  const handleSave = (editedItem) => {
    if (editedItem.id) {
      setHistoryItems(historyItems.map(item => (item.id === editedItem.id ? editedItem : item)));
    } else {
      editedItem.id = Date.now();
      setHistoryItems([...historyItems, editedItem]);
    }
  };

  const handleDelete = (id) => {
    setHistoryItems(historyItems.filter(item => item.id !== id));
  };

  return (
    <HistoryContext.Provider value={{ historyItems, handleSave, handleDelete }}>
      {children}
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;
