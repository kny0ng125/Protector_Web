import React from 'react';
import './SearchAndList.css';

const SearchAndList = () => {
  return (
    <div className="search-and-list">
      <div className="search-bar">
        <select>
          <option>UUID</option>
        </select>
        <input type="text" placeholder="검색하기..." />
      </div>
      <div className="patient-list">
        <p>정재욱 #XOEIF5GJ</p>
        <p>정재욱 #ASTANKBOY</p>
      </div>
    </div>
  );
};

export default SearchAndList;
