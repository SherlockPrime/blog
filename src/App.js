import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [isNavOpen, setNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [userAddress, setUserAddress] = useState("Getting location...");

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
  
  

  const returnToMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const locPosition = new window.kakao.maps.LatLng(lat, lon);
        if (map) {
          map.setCenter(locPosition);
          if (marker) {
            marker.setMap(null);
          }
          const newMarker = new window.kakao.maps.Marker({
            map: map,
            position: locPosition
          });
          setMarker(newMarker);

          getGeoLocation(lat, lon); // Update address
        }
      });
    } else {
      alert('Geolocation not supported');
    }
  };

  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
      level: 3
    };
    const createdMap = new window.kakao.maps.Map(container, options);
    setMap(createdMap);
    

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const locPosition = new window.kakao.maps.LatLng(lat, lon);

        createdMap.setCenter(locPosition);

        const initialMarker = new window.kakao.maps.Marker({
          map: createdMap,
          position: locPosition
        });
        setMarker(initialMarker);

        getGeoLocation(lat, lon); // Update address initially
      });
    }
    
  }, []);



const zoomIn = () => {
  if (map) {
    const level = map.getLevel();
    map.setLevel(level - 1);
  }
};

const zoomOut = () => {
  if (map) {
    const level = map.getLevel();
    map.setLevel(level + 1);
  }
};

  const toggleNav = () => setNavOpen(!isNavOpen);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
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
          <h2>Login</h2>
          {!isLoggedIn ? (
            <div className="login-form">
              <input type="text" placeholder="아이디" value={username} onChange={(e) => setUsername(e.target.value)} />
              <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button onClick={() => setIsLoggedIn(true)}>로그인</button>
              <Link to="/signup" className="signup-text">회원가입</Link>
            </div>
          ) : (
            <div>
              <ul>
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>
              </ul>
              <button onClick={handleLogout}>로그아웃</button>
            </div>
          )}
        </div>
      )}
      <div id="map" style={{ width: '100%', height: '80vh' }}>
      </div>
      <button className="add-errand-button">심부름 추가하기</button>
      <div className="zoom-button-container">
        <button className="zoom-button" onClick={zoomIn}>줌 인</button>
        <button className="zoom-button" onClick={zoomOut}>줌 아웃</button>
        <button className="zoom-button" onClick={returnToMyLocation}>
          내 위치
        </button>
      </div>
      
    </div>
  );
}

export default App;