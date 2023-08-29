import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [isNavOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
      level: 3
    };
    // eslint-disable-next-line no-unused-vars
    const map = new window.kakao.maps.Map(container, options);
  }, []);

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };

  return (
    <div className="App">
      <div className="header">
      <img src="./logo1.png" alt="Header" className="logo" />
        <h1>My Map Application</h1>
      </div>
      <button className="toggle-button" onClick={toggleNav}>
        {isNavOpen ? 'Close Nav' : 'Open Nav'}
      </button>
      {isNavOpen && (
        <div className="right-nav">
          <h2>Navigation</h2>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>
      )}
      <div id="map" style={{ width: '100%', height: '80vh' }}></div>
    </div>
  );
}

export default App;