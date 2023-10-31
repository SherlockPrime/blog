import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './App.css';

function PostDetail() {
  const currentTime = new Date();
  const navigate = useNavigate();
  const [postDetail, setPostDetail] = useState({});
  const ernd_vtime = new Date(postDetail.ernd_vtime);
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");
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
    };

    const fetchPostDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/posts/${id}`);
        setPostDetail(response.data);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/comments/${id}`);
        setNewComment(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchPostDetail();
    fetchComments();
  }, [id]);

  

  const navigateToList = () => {
    navigate('/ErrandList');
}


const handleCompleteTransaction = async () => {
  try {
    const response = await axios.post(`http://localhost:3001/completeTransaction`, {
      postId: id,
      reward: postDetail.ernd_rew,
      writerId: getCookie('id'),
      executorId: postDetail.Customer_csm_id
    });

    const data = response.data;
    if (data.success) {
      alert("거래 성사 완료!");
      setPostDetail(prevState => ({ ...prevState, ernd_acpt: true }));
    } else {
      alert(data.msg);
    }
  } catch (error) {
    console.error("Error completing transaction:", error);
  }
};

  const handleAccept = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/acceptPost/${id}`, {
        acceptedId: getCookie('id')
      });
      const data = response.data;
      if (data.success) {
        alert("심부름을 진행합니다!");

        setPostDetail(prevState => ({ ...prevState, Customer_csm_id: getCookie('id') }));
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error("Error accepting post:", error);
    }
  };
  

  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/comments`, {
        comm_content: newComment,
        Customer_csm_id: getCookie('id'),
        comm_rec_id: postDetail.csm_id,
        post_id: id
      });
      if (response.data.success) {
        setNewComment("");
        alert("쪽지를 성공적으로 보냈습니다.");
      } else {
        alert("쪽지를 보낼 수 없습니다.");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
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
    <div>
      <div className='errand-detail' style={{ textAlign: 'left' }}>
        <h2>심부름 정보</h2>
        <button onClick={navigateToList}>심부름 목록</button>      
      </div>
      <p>작성자: {postDetail.csm_id}</p>
      {postDetail ? (
        <div>
          <h3>{postDetail.ernd_title}</h3>
          <p> 주소 : {postDetail.ernd_pos}</p>
          <p> 유효기한 : {postDetail.ernd_vtime}</p>
          <p>{postDetail.ernd_det}</p>
          {postDetail.Customer_csm_id && <p style={{ color: 'red', fontWeight: 'bold' }}>심부름 진행자 : {postDetail.Customer_csm_id}</p>}
          {(!postDetail.Customer_csm_id && // 현재 심부름을 수행하고 있는 회원이 없어야 수락할 수 있고
              getCookie('id') !== postDetail.csm_id &&  // 심부름 제안자가 본인이 아니어야 수락할 수 있고
              ernd_vtime > currentTime) && // 유효기간이 지나지 않았어야 한다
              <button onClick={() => handleAccept(postDetail.ernd_no)}>수락하기</button>}
          
          {postDetail.csm_id === getCookie('id') && postDetail.Customer_csm_id && !postDetail.ernd_acpt && ernd_vtime > currentTime &&
          <div className='errand-sure'>
            <button onClick={handleCompleteTransaction}>거래 성사</button>
          </div>
          }

          {postDetail.csm_id !== getCookie('id') && (
          <div className='Comment-submit'>
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="내용을 입력하세요..."
            />
            <button onClick={handleCommentSubmit}>쪽지 작성</button>
          </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </div>
  );
}

export default PostDetail;