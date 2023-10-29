import React, { useState } from 'react';
import { Link, useNavigate, useLocation} from 'react-router-dom';
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
    <div>
      <div>
        <h2>게시글 작성</h2>
        <div>
          <label>제목:</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        <div>
          <label>카테고리:</label>
          <input 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
          />
        </div>
        <div>
          <label>위치 정보:</label>
          <input 
            value={position} 
            readOnly
          />
        </div>
        <div>
          <label>보상 내용:</label>
          <input 
            value={reward}
            type='number'
            onChange={(e) => setReward(e.target.value)} 
          /> 포인트
        </div>
        <div>
    <label>유효 기간:</label>
    <input 
        type="datetime-local"
        value={vtime}
        onChange={(e) => setVtime(e.target.value)}
    />
</div>

        <div>
          <label>내용:</label>
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
          />
        </div>
        <button onClick={handleSubmit}>게시하기</button>
      </div>
      
    </div>
  );
}

export default Errand_reg;