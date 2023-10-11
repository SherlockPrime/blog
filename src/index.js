import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Signup from './Signup';
import Mypage from './Mypage';
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
      </Routes>
    </Router>
  );


  /*
  root.render(
    <Router>
      <Routes>
        <Route path="/profile" element={<profile />} />
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  );
*/
  root.render(
    <Router>
      <Routes>
        <Route path="/Mypage" element={<Mypage />} />
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  );
}

