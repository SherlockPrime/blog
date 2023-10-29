import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SendComment() {
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? value[2] : null;
  }

  useEffect(() => {
    const fetchComments = async () => {
      const userId = getCookie('id');
      try {
        // 수정된 API 엔드포인트를 사용합니다.
        const response = await axios.get(`http://localhost:3001/sendcomments/${userId}`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching sent comments:", error);
      }
    };

    fetchComments();
  }, []);

  return (
    <div>
      <h2>발신 쪽지함</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {comments.map((comment, index) => {
          const showReceiver = index === 0 || comments[index - 1].comm_rec_id !== comment.comm_rec_id;
          return (
            <li key={index} style={{ marginBottom: '16px' }}>
              {showReceiver && <p><strong>수신자: {comment.comm_rec_id}</strong></p>}
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

    export default SendComment;