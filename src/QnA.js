import React from 'react';
import { Link } from 'react-router-dom';
import './QnA.css';

const QnA = () => {
    const inquiries = [
      { inquiryDate: '2023-09-01', title: '정보 수정은 어떻게 하나요?', answerDate: '2023-09-02', status: '답변 완료' },
      { inquiryDate: '2023-09-05', title: '생일 이벤트는 없나요?', answerDate: '2023-09-06', status: '답변 완료' },
      { inquiryDate: '2023-09-07', title: '페이지 접속이 안됩니다.', answerDate: '대기 중', status: '접수 중' },
    ];
  
    return (
      <div>
        <div className="header-section">
          <h2>문의 사항</h2>
          <Link to="/inquiry-form">
            <button className="inquiry-button">문의하기</button>
        </Link>
        </div>

        <table>
          <thead>
            <tr>
              <th>문의일</th>
              <th>제목</th>
              <th>답변일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry, index) => (
              <tr key={index} onClick={() => window.location.href='/inquiry/${index}'}>
                <td>{inquiry.inquiryDate}</td>
                <td>{inquiry.title}</td>
                <td>{inquiry.answerDate}</td>
                <td>{inquiry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
      <Link to="/" className="home-button">홈으로 돌아가기</Link>
    </div>
  );
};

export default QnA;