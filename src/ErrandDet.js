import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';

function PostDetail() {
  const currentTime = new Date();
  const navigate = useNavigate();
  const [postDetail, setPostDetail] = useState({});
  const ernd_vtime = new Date(postDetail.ernd_vtime);
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");
  useEffect(() => {
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


  function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
  }


  return (
    <div>
      <div className='errand-detail'>
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
  );
}

export default PostDetail;