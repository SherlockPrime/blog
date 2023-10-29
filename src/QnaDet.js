import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function QnaDet() {
    const [qnaDetail, setQnaDetail] = useState('');
    const navigate = useNavigate();
    function getCookie(name) {
        var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value? value[2] : null;
      }

    const navigateToList = () => {
        navigate('/QnaList');
    };
    const handleSubmit = async () => {
        if (!qnaDetail.trim()) {
            alert('문의사항 내용을 입력해주세요.');
            return;
        }
        try {
            const now = new Date();
            const offset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로
            const kstDate = new Date(now.getTime() + offset);
            const currentDateTime = kstDate.toISOString().slice(0, 19).replace('T', ' ');
            const data = {
                qna_det: qnaDetail,
                qna_time: currentDateTime,
                Customer_csm_id: getCookie('id')
            };
            await axios.post('http://localhost:3001/qna', data);
            alert('문의사항이 제출되었습니다.');
            navigate('/QnaList'); 
        } catch (error) {
            console.error("Error submitting QnA:", error);
            alert('문의사항 제출 중 오류가 발생했습니다.');
        }
    };
    
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>문의사항 작성</h2>
                <button onClick={navigateToList}>문의사항 리스트로</button>
            </div>
            
            <textarea
                value={qnaDetail}
                onChange={(e) => setQnaDetail(e.target.value)}
                placeholder="문의 내용을 입력하세요."
                rows="10"
                cols="50"
            />
            <br />
            <button onClick={handleSubmit}>제출</button>
        </div>
    );
}

export default QnaDet;