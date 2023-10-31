import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const redirectToHome = () => {
    window.location.href = "/";  // 웹사이트의 홈 URL로 변경하세요.
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        backgroundColor: '#ffffff'
    },
    header: {
        textAlign: 'center',
        marginBottom: '100px'
    },
    input: {
        width: '96%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
        marginBottom: '20px'
    },
    button: {
        width: '100%',
        padding: '12px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#FFEB00',
        color: '#000',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        marginBottom: '80px'
    },
    homeButton: {
        marginTop: '20px',
        backgroundColor: '#4CAF50',  // 예시 색상, 원하는 색상 코드로 변경할 수 있습니다.
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'center',
        display: 'block',
        margin: '0 auto'
    }
};

const Pay = () => {
    const [amount, setAmount] = useState(''); // 사용자가 지불할 금액
    const [points, setPoints] = useState(0); // 사용자의 포인트

    // 상태 관리를 위한 useState 훅을 사용
  const [isNavOpen, setNavOpen] = useState(false); // 네비게이션 메뉴의 열림/닫힘 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 사용자의 로그인 상태
  const [username, setUsername] = useState(""); // 사용자의 아이디 입력
  const [password, setPassword] = useState(""); // 사용자의 비밀번호 입력

  const [userAddress, setUserAddress] = useState("Getting location..."); // 사용자의 주소
  const [isMapVisible, setMapVisible] = useState(true);
  const [csmName, setCsmName] = useState("");


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

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const loggedInUserId = getCookie('id');
    

    useEffect( ()=>{
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
    };

        (async() =>
        {
          try{
            const response = await fetch('http://localhost:3001/getPoints/' + loggedInUserId, { 
              method: 'GET',
            });
      
            const result = await response.json();
            setPoints(result.points);
          }catch{
      
          }
          
        })();
      }, [])

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

    const handlePayment = async () => {
        try {
            const response = await fetch('http://localhost:3001/payment/ready', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                
                body: JSON.stringify({ amount: amount, userId: loggedInUserId}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            const paymentUrl = result.next_redirect_pc_url;
            window.location.href = paymentUrl;
        } catch (error) {
            console.error("결제 에러:", error);
        }
    };

    const convertToPoints = (amount) => {
        return amount * 1; // 예: 1원 = 1포인트
    };

    const handleSuccessPayment = (amount) => {
        const newPoints = convertToPoints(amount);
        setPoints(prevPoints => prevPoints + newPoints);
    };

    const handlePaymentSuccess = async () => {
        try {
            const response = await fetch('http://localhost:3001/payment/approve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                
                body: JSON.stringify({userId: loggedInUserId}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.status === "success") {
                handleSuccessPayment(amount);
            }
        } catch (error) {
            console.error("결제 확인 에러:", error);
        }
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
        <li>{getCookie('id')} 님 안녕하세요</li>
          <li><Link to = "/Profile">My Page</Link></li>
          <li><Link to = "/Errandlist">심부름 목록</Link></li>
          <li><Link to = "/QnaList">문의사항</Link></li>
        </ul>
        <button onClick={handleLogout}>로그아웃</button>
      </div>
    )}
  </div>
)}
      <div id="map" style={{ width: '100%', height: isMapVisible ? '80vh' : '0', visibility: isMapVisible ? 'visible' : 'hidden' }}>
      </div>
        <div style={styles.container}>
            <h1 style={styles.header}>결제 페이지</h1>
            <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="결제할 금액을 입력하세요"
                style={styles.input}
            />
            <button onClick={handlePayment} style={styles.button}>
                카카오페이로 결제
            </button>
            <h2 style={styles.header}>내 포인트 : {points}점</h2>
            <button style={styles.homeButton} onClick={redirectToHome}>
                홈으로 돌아가기</button>
        </div>
        </div>
    );
};

export default Pay;