import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation} from 'react-router-dom';
import './App.css';
function Errand_reg() {
  const navigate = useNavigate();
  const location = useLocation();
  const [category, setCategory] = useState(''); //카테고리
  const [posts, setPosts] = useState([]);
  const query = new URLSearchParams(location.search);
  const initialAddress = query.get('address') ? decodeURIComponent(query.get('address')) : '';
  const [position, setPosition] = useState(initialAddress);
  const [reward, setReward] = useState('');
  const [vtime, setVtime] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [csm_id, setCsm_id] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const initialLat = query.get('lat') ? parseFloat(query.get('lat')) : null;
  const initialLng = query.get('lng') ? parseFloat(query.get('lng')) : null;
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
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

function getCookie(name) {
  var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value? value[2] : null;
}

  const handleSubmit = (e) => {

    
    e.preventDefault();
    
    function getCookie(name) {
      var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
      return value? value[2] : null;
    }
    const newPost = {
      category : category,
      position : position,
      lat: lat,            // 위도
      lng: lng,
      reward : reward,
      vtime : vtime,
      title : title,
      content : content,
      csm_id : getCookie('id')
    };

    if (category ==="" || posts==="" ||  reward==="" || vtime==="" || title==="" || content === "") {
      setError('Fill in a blank');
      alert("공백을 채우세요!")
      return;
    }

    setPosts([...posts, newPost])
    /*
    setPosition('');
    setTitle('');
    setContent('');
    setCategory(''); //선택형 필요
    setPosition(''); //위치 정보 가져와서 디폴트 값으로 넣어야 함
    setReward('');
    setVtime(''); // 유효 시간  
    setCsm_id(''); // 현재 로그인한 아이디 쿠키값에 미리 저장해서 쿠키값으로 가져와야 함
    */
    fetch('http://localhost:3001/Errand_reg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    })
    .then(response => response.json())
    .then(data => {
        setLoading(false);

        if (data.success) {
            navigate('/'); // 심부름 등록 후 리다이렉션 할 경로
        } else {
            setError(data.error);
        }
    })
    .catch(err => {
        setLoading(false);
        setError('Something went wrong.');
    });
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
    
    <div className="Errandwrite">
      <div className="Errand-write">
        <h2>심부름 게시글 작성</h2>
        <div className='title'>
          <label>제목</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="제목을 입력하세요"
          />
        </div>
        <div className='category'>
          <label>카테고리</label>
          <input 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            placeholder="카테고리를 입력하세요"
          />
        </div>
        <div className='location'>
          <label>위치 정보</label>
          <input 
            value={position} 
            readOnly
          />
        </div>
        <div className='reward'>
          <label>보상 내용</label>
          <input 
            value={reward}
            type='number'
            onChange={(e) => setReward(e.target.value)} 
            placeholder="보상 포인트를 입력하세요"
          /> 포인트
        </div>
        <div>
          <label>유효 기간</label>
          <input 
            type="datetime-local"
            value={vtime}
            onChange={(e) => setVtime(e.target.value)}
          />
      </div>

      <div>
        <label>내용</label>
        <textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          placeholder="심부름 상세 내용을 입력하세요"
        />
      </div>
        <button onClick={handleSubmit}>게시하기</button>
    </div>
      
  </div>
  </div>
  );
}

export default Errand_reg;