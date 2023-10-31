import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Mypage = () => {

  return (
    <div className="my-page">
      <h1>나의 활동</h1>
      <table className="activity-table">
        <tbody>
          <tr>
            <td>
              <Link to="/MyErrand">작성한 심부름</Link>
            </td>
          </tr>
          <tr>
            <td>
              <Link to="/SendComment">발신 쪽지함</Link>
            </td>
          </tr>
          <tr>
            <td>
              <Link to="/RecComment">수신 쪽지함</Link>
            </td>
          </tr>
          <tr>
            <td>
              <Link to="/Pay">포인트 충전</Link>
            </td>
          </tr>
        </tbody>
      </table>
      <Link to="/" className="home-button">홈으로 돌아가기</Link>
    </div>
  );
};

export default Mypage;