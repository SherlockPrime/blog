import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Mypage from './Mypage';
import './App.css';


// import axios from 'axios';

function Profile() {
  // 상태 관리를 위한 useState 훅을 사용
  const [isNavOpen, setNavOpen] = useState(false); // 네비게이션 메뉴의 열림/닫힘 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 사용자의 로그인 상태
  const [username, setUsername] = useState(""); // 사용자의 아이디 입력
  const [password, setPassword] = useState(""); // 사용자의 비밀번호 입력

  const [userAddress, setUserAddress] = useState("Getting location..."); // 사용자의 주소
  const [isMapVisible, setMapVisible] = useState(true);
  const [csmName, setCsmName] = useState("");
  const [points, setPoints] = useState(100);


  // 현재 사용자의 위도와 경도를 기반으로 주소를 가져오는 함수
  const getGeoLocation = (lat, lon) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    const coord = new window.kakao.maps.LatLng(lat, lon);
    geocoder.coord2Address(coord.getLng(), coord.getLat(), function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        // 도로명 주소 대신 일반 주소를 사용
        const detailAddr = result[0].address ? result[0].address.address_name : '';
        setUserAddress(detailAddr);
      }
    });
  };
  
  // 사용자의 현재 위치로 지도를 다시 중심 설정하는 함수
  

  useEffect(() => {
    setMapVisible(false); // 이 줄을 추가하여 지도를 숨김 상태로 설정
    // 로컬 스토리지에서 로그인 상태를 확인하고, 지도를 설정
    const loggedInUser = localStorage.getItem("isLoggedIn");
    const storedCsmName = localStorage.getItem("csm_name");
  
    if (loggedInUser) {
      setIsLoggedIn(true);
      setCsmName(storedCsmName || "");
    }
  
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
      level: 3
    };
    const createdMap = new window.kakao.maps.Map(container, options);
    
    

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const locPosition = new window.kakao.maps.LatLng(lat, lon);

        createdMap.setCenter(locPosition);

      
        

        getGeoLocation(lat, lon); // Update address initially
      });
    }
    
  }, []);


// 네비게이션 토글
  const toggleNav = () => setNavOpen(!isNavOpen);

// 엔터 키를 누르면 로그인을 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }


// 로그인 처리
 const handleLogin = () => {
  fetch('http://localhost:3001/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    csm_id: username,
    csm_pwd: password
  })
})
.then(response => response.json())

.then(data => {
  console.log("Login response data:", data);
  if (data.status === 'success') {
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("csm_name", data.csm_name);
    setCsmName(data.csm_name);
      setIsLoggedIn(true);
  } else {
    alert(data.message);
  }
})
.catch(error => {
  console.error("There was an error!", error);
});
};

const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  setIsLoggedIn(false);
  setUsername("");
  setPassword("");
  setCsmName("");
};

  return (
    <div className="App">
      <div className="header">
        <img src="./logo1.png" alt="Header" className="logo" />
        
        <div className="user-address">{userAddress}</div>
      </div>
      <button className="toggle-button" onClick={toggleNav}>
        {isNavOpen ? 'Close Nav' : 'Open Nav'}
      </button>
      {isNavOpen && (
  <div className="right-nav">
    {!isLoggedIn ? (
      <div>
        <h2>Login</h2>
      <div className="login-form">
        <input type="text" placeholder="아이디" value={username} onChange={(e) => setUsername(e.target.value)} onKeyPress={handleKeyPress}/>
        <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={handleKeyPress}/>
        <button onClick={handleLogin}>로그인</button>
        <Link to="/Signup" className="signup-text">회원가입</Link>
      </div>
      </div>
    ) : (
      <div>
        <ul>
          <li><Link to = "/Profile">My Page</Link></li>
          <li>심부름 목록</li>
          <li>문의사항</li>
        </ul>
        <button onClick={handleLogout}>로그아웃</button>
      </div>
    )}
  </div>
)}
      <div id="map" style={{ width: '100%', height: isMapVisible ? '80vh' : '0', visibility: isMapVisible ? 'visible' : 'hidden' }}>
      </div>
      <div className="profile-section">
        <img src="./profile.png" alt="Profile" className="profile-picture" />
        <div> {csmName} </div>
        <div className="profile-points">보유 포인트 : {points}</div> {/* 보유 포인트 추가 */}
      </div>

      <Mypage />
    </div>
  );
}

export default Profile;