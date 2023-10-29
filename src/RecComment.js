import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';

function RecComment() {
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  // 쿠키에서 아이디 값을 가져오는 함수
  function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? value[2] : null;
  }

  useEffect(() => {
    const fetchComments = async () => {
      const userId = getCookie('id');
      try {
        const response = await axios.get(`http://localhost:3001/comments/${userId}`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, []);

  return (
    <div>
      <h2>받은 쪽지함</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {comments.map((comment, index) => {
          const showSender = index === 0 || comments[index - 1].Customer_csm_id !== comment.Customer_csm_id;
          return (
            <li key={index} style={{ marginBottom: '16px' }}>
              {showSender && <p><strong>발신자: {comment.Customer_csm_id}</strong></p>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>{comment.comm_content}</p>
                <span style={{ marginLeft: '8px', color: 'gray' }}>{comment.comm_time}</span>
              </div>
            </li>
          );
        })}
      </ul>
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
      <button onClick={() => navigate(-1)}>뒤로가기</button>
      </div>
    </div>
  );
}

export default RecComment;