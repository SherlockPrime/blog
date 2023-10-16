import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

// import axios from 'axios';

function App() {
  // 상태 관리를 위한 useState 훅을 사용
  const [isNavOpen, setNavOpen] = useState(false); // 네비게이션 메뉴의 열림/닫힘 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 사용자의 로그인 상태
  const [username, setUsername] = useState(""); // 사용자의 아이디 입력
  const [password, setPassword] = useState(""); // 사용자의 비밀번호 입력
  const [map, setMap] = useState(null); // 카카오 맵 객체
  const [marker, setMarker] = useState(null); // 지도 상의 마커 객체
  const [userAddress, setUserAddress] = useState("Getting location..."); // 사용자의 주소

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
    // 로컬 스토리지에서 로그인 상태를 확인하고, 지도를 설정
    const loggedInUser = localStorage.getItem("isLoggedIn");

    if (loggedInUser) {
      setIsLoggedIn(true);
    }

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


// 지도 확대
const zoomIn = () => {
  if (map) {
    const level = map.getLevel();
    map.setLevel(level - 1);
  }
};

// 지도 축소
const zoomOut = () => {
  if (map) {
    const level = map.getLevel();
    map.setLevel(level + 1);
  }
};

// 네비게이션 토글
  const toggleNav = () => setNavOpen(!isNavOpen);

// 엔터 키를 누르면 로그인을 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }

  /* const handleLogin = () => {
    axios.post('http://localhost:3001/login', {
      csm_id: username,
      csm_pwd: password
    }).then(response => {
        if (response.data.status === 'success') {
            setIsLoggedIn(true);
        } else {
            alert(response.data.message);
        }
    }).catch(error => {
        console.error("There was an error!", error);
    });
};
*/

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
      <div id="map" style={{ width: '100%', height: '80vh' }}>
      </div>
      {isLoggedIn && ( // 로그인 상태일 때만 버튼이 보이도록 조건부 렌더링 사용
      <button className="add-errand-button">심부름 추가하기</button>
    )}
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