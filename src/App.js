import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [isNavOpen, setNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
      level: 3
    };
    new window.kakao.maps.Map(container, options);
  }, []);

  const toggleNav = () => setNavOpen(!isNavOpen);

  return (
    <div className="App">
      <div className="header">
        <img src="./logo1.png" alt="Header" className="logo" />
        <h1>My Map Application</h1>
      </div>
      <button className="toggle-button" onClick={toggleNav}>
        {isNavOpen ? 'Close Nav' : 'Open Nav'}
      </button>
      {isNavOpen && (
        <div className="right-nav">
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
              <li>Home</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          )}
        </div>
      )}
      <div id="map" style={{ width: '100%', height: '80vh' }}></div>
    </div>
  );
}

export default App;
