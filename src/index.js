import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import App from './App';
import Signup from './Signup';
import Profile from './Profile';
import Pay from './Pay';
import Errand_reg from './Errand_reg';
import Errandlist from './Errandlist';
import ErrandDet from './ErrandDet';
import QnaList from './QnaList';
import QnaDet from './QnaDet';
import SendComment from './SendComment';
import RecComment from './RecComment';
import MyErrand from './MyErrand';

// import Profile from './Profile';

// 루트 요소를 찾기.
const rootElement = document.getElementById('root');

// createRoot를 사용하여 루트를 생성.
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  // 루트에 대한 렌더링은 이 방법으로 수행.
  root.render(
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/Errand_reg" element={<Errand_reg />} />
        <Route path="/Errandlist" element={<Errandlist />} />
        <Route path="/QnaList" element={<QnaList />} />
        <Route path="/post/:id" element={<ErrandDet />} />
        <Route path="/SendComment" element={<SendComment />}/>
        <Route path="/RecComment" element={<RecComment />}/>
        <Route path="/MyErrand" element={<MyErrand />}/>
        <Route path="/QnaDet" element={<QnaDet />}/>
      </Routes>
    </Router>
  );




}
