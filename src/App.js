import React, { useEffect,useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import axios from 'axios';
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
  const [ernd_pos, setErndPos] = useState(null);
  const currentTime = new Date(); // 현재 시간을 가져옵니다.
  let statusMessage = ""; // 상태 메시지를 저장할 변수를 선언합니다.


  const [errandPosts, setErrandPosts] = useState([]);
  const [isAddingErrand, setIsAddingErrand] = useState(false);
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  
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


  useEffect(() => {
    if (!isAddingErrand && map && isLoggedIn) {
      // 게시물 데이터 로드 로직
      axios.get('http://localhost:3001/posts').then(response => {
        const data = response.data;
        for (let i = 0; i < data.length; i++) {
          const position = new window.kakao.maps.LatLng(data[i].ernd_lat, data[i].ernd_lng);
          const marker = new window.kakao.maps.Marker({
            position
          });
          marker.setMap(map);
          
          // InfoWindow에 들어갈 내용을 만들기 위한 변수 초기화
          let contentString = `<div style="white-space: nowrap; overflow: visible;">`;
          contentString += `<div>카테고리 : ${data[i].ernd_cat}</div>`;
          contentString += `<div>${data[i].ernd_title}</div>`;
          contentString += `<div>보상 : \\ ${data[i].ernd_rew}</div>`;

          // 현재 시간과 ernd_vtime을 비교
          const currentTime = new Date().getTime();
          const erndVtime = new Date(data[i].ernd_vtime).getTime();


          if (currentTime > erndVtime) {
            contentString += "<div style='color: gray;'>기한 만료</div>";
        } else if (data[i].ernd_acpt === 1) {
            contentString += "<div style='color: red;'>심부름 완료</div>";
        } else if (data[i].Customer_csm_id !== null) {
            contentString += "<div style='color: green;'>심부름 진행중</div>";
        } else {
            contentString += "<div style='color: blue;'>심부름 진행 가능</div>";
        }


          const infowindow = new window.kakao.maps.InfoWindow({
            content: contentString
          });
          window.kakao.maps.event.addListener(marker, 'click', function() {
            // 클릭했을 때, 해당 게시물의 상세 페이지로 이동하는 로직
            window.location.href = `/post/${data[i].ernd_no}`;
          });
          window.kakao.maps.event.addListener(marker, 'mouseover', function() {
            infowindow.open(map, marker);
          });
          window.kakao.maps.event.addListener(marker, 'mouseout', function() {
            infowindow.close();
          });
        }
      }).catch(error => {
        console.error("Error fetching posts:", error);
      });
    }
  }, [isAddingErrand, map, isLoggedIn]);

  

  const handleMapClick = (mouseEvent) => {
    // Get latitude and longitude from the mouseEvent
    const latlng = mouseEvent.latLng;
  
    // Check if marker already exists
    if (marker) {
      // Update marker's position
      marker.setPosition(latlng);
    } else {
      // Create a new marker
      const newMarker = new window.kakao.maps.Marker({
        map: map,
        position: latlng
      });
      setMarker(newMarker); // Save the new marker in the state
    }
  
    // Update the ernd_pos state
    setErndPos({lat: latlng.getLat(), lng: latlng.getLng()});
    // Optionally, update the address displayed to the user
    getGeoLocation(latlng.getLat(), latlng.getLng());
  };

  const addErrand = () => {
    setIsAddingErrand(true); // 심부름 추가 모드 활성화
    if (marker) {
      window.kakao.maps.event.removeListener(map, 'click', handleMapClick);
    }
    window.kakao.maps.event.addListener(map, 'click', handleMapClick);
  };

  const confirmLocation = () => {
    setIsAddingErrand(false); // 심부름 추가 모드 비활성화
     const lat = ernd_pos ? ernd_pos.lat : null;
    const lng = ernd_pos ? ernd_pos.lng : null;

  if(lat && lng) {
    window.location.href = `https://localhost:3000/Errand_reg?address=${encodeURIComponent(userAddress)}&lat=${lat}&lng=${lng}`;
  } else {
    alert("위치를 선택해주세요.");
  }
  };

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
    document.cookie = "id=" + username + "; path=/"
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
  document.cookie = "id=" + "" + "; path=/"
};

function getCookie(name) {
  var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value? value[2] : null;
}


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
          <li>{getCookie('id')} 님 안녕하세요</li>
          <br></br>
          <li><Link to = "/Profile">My Page</Link></li>
          <li><Link to = "/Errandlist">심부름 목록</Link></li>
          <li><Link to = "/QnaList">문의사항</Link></li>
        </ul>
        <button onClick={handleLogout}>로그아웃</button>
      </div>
    )}
  </div>
)}
      <div id="map" style={{ width: '100%', height: '80vh' }}>
      {isAddingErrand && <div className="confirm-box">지도에서 위치 확인</div>}
      </div>
      {isLoggedIn && !isAddingErrand && ( // 로그인 상태이며, 심부름 추가 모드가 아닐 때
        <button className="add-errand-button" onClick={addErrand}>심부름 추가하기</button> 
      )}
      {isLoggedIn && isAddingErrand && ( // 로그인 상태이며, 심부름 추가 모드일 떄
        <button className="add-errand-button" onClick={() => setIsAddingErrand(false)}>심부름 추가 모드 취소</button> 
      )}
      {isAddingErrand && ( // 심부름 추가 모드일 때
        <>
          <div className="selected-position">
            선택된 위치: {ernd_pos ? `위도: ${ernd_pos.lat}, 경도: ${ernd_pos.lng}` : '위치를 선택하세요'}
          </div>
          <button className="confirm-location-button" onClick={confirmLocation}>이 위치로 심부름 등록하기</button>
        </>
      )}
      {!isAddingErrand && ( // 심부름 추가 모드가 아닐 때만 버튼 표시
      <div className="zoom-button-container">
        <button className="zoom-button" onClick={zoomIn}>줌 인</button>
        <button className="zoom-button" onClick={zoomOut}>줌 아웃</button>
        <button className="zoom-button" onClick={returnToMyLocation}>
          내 위치
        </button>
      </div>
      )}
    </div>
  );
}

export default App;