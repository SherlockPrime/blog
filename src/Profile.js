import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import Mypage from './Mypage';

function Profile() {
  const [isNavOpen, setNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const toggleNav = () => setNavOpen(!isNavOpen);
  const profileName = "Seonu2000";
  const [points, setPoints] = useState(100);

  return (
    <div className="App">
      <div className="header">
        <img src="./logo1.png" alt="Header" className="logo" />
        <h1>My Map Application</h1>
      </div>

      <div className="profile-section">
        <img src="./profile.png" alt="Profile" className="profile-picture" />
        <div className="profile-name">{profileName}</div>
        <div className="profile-points">보유 포인트 : {points}</div> {/* 보유 포인트 추가 */}
      </div>

      <button className="toggle-button" onClick={toggleNav}>
      {isNavOpen ? <i className="fa fa-bars"></i> : <i className="fa fa-bars"></i>}
      </button>
      {isNavOpen && (
       <div className={`right-nav ${isNavOpen ? 'open' : ''}`}>
          <h2>Login</h2>
          {!isLoggedIn ? (
            <div className="login-form">
              <input type="text" placeholder="아이디" value={username} onChange={(e) => setUsername(e.target.value)} />
              <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button onClick={() => setIsLoggedIn(true)}>로그인</button>
              <Link to="/signup" className="signup-text">회원가입</Link>
            </div>
          ) : (
            <ul>
              <li>My Page</li>
              <li>심부름 목록</li>
              <li>문의사항</li>
            </ul>
          )}
        </div>
      )}
      <Mypage />
    </div>
  );
}

export default Profile;