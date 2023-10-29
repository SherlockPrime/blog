import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HorizonLine from './horzline';
import "./listdot.css";

function QnaList() {
  const [answerInputs, setAnswerInputs] = useState({});
  const [QnaPosts, setQnaPosts] = useState([]);
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/');
  };
  function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
  }

  useEffect(() => {
    async function fetchQnaPosts() {
      try {
        const response = await axios.get('http://localhost:3001/QnaList');
        setQnaPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    fetchQnaPosts();
  }, []);

  const handleInputChange = (qna_no, value) => {
      setAnswerInputs(prev => ({
        ...prev,
        [qna_no]: value
      }));
    };
  const handleAnswerSubmit = async (qna_no, answer) => {
    if (getCookie('id') !== 'admin') {
      alert('관리자만 답변할 수 있습니다.');
      return;
    }

    try {
      await axios.put(`http://localhost:3001/QnaList/${qna_no}`, { qna_ans: answer });
      // 답변 후 목록 새로고침
      window.location.reload();
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert('답변 등록 중 오류가 발생했습니다.');
    }
  };
  
  const handleNavigateToWrite = () => { // 추가된 부분
    navigate('/QnaDet'); // 경로는 QnaDet.js 페이지의 정확한 경로로 수정해야 합니다.
  };

  return (
    <div>
      <h2>문의사항 목록</h2>
      <div style={{ textAlign: 'right' }}>
    <button onClick={handleNavigateToWrite}>문의사항 작성하기</button>
    <button onClick={navigateToHome}>홈으로</button>
</div>
<ul>
        {QnaPosts.slice().reverse().map(Qnapost => (
          <li className="nodot" key={Qnapost.qna_no}>
            {Qnapost.qna_no}<br />
            <strong>{Qnapost.qna_det}</strong> <br />
            작성자 : {Qnapost.Customer_csm_id} <br />
            작성시간 : {Qnapost.qna_time}
            <div style={{ textAlign: 'right' }}>
              {Qnapost.qna_ans ? (
                <>
                  <strong>답변:</strong> {Qnapost.qna_ans}
                </>
              ) : getCookie('id') === 'admin' ? (
                <div>
              <input
                type="text"
                placeholder="답변을 입력하세요"
                value={answerInputs[Qnapost.qna_no] || ""}
                onChange={(e) => handleInputChange(Qnapost.qna_no, e.target.value)}
              />
              <button onClick={() => handleAnswerSubmit(Qnapost.qna_no,answerInputs[Qnapost.qna_no])}>답변 제출</button>
            </div>
              ) : null}
            </div>
            <HorizonLine />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QnaList;