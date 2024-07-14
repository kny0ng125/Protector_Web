import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout, toggleAuth } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {isAuthenticated && <Link to="/mainscreen">Home</Link>}
        {isAuthenticated && <Link to="/history" className="navbar-button">History</Link>}
        {isAuthenticated && <Link to="/health-info" className="navbar-button">Info</Link>}
      </div>
      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            <span className="navbar-user">Doctor1</span>
            <button onClick={logout} className="navbar-button">로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-button">로그인</Link>
            <Link to="/signup" className="navbar-button">회원가입</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
