import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();

  const handleSignup = () => {
    // Add your signup logic here.
    // After signup, navigate back to main page with the user logged in.
    navigate('/', { replace: true });
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h1>회원가입</h1>
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button onClick={handleSignup}>회원가입</button>
        <Link to="/" className="signup-link">Go back to main page</Link>
      </div>
    </div>
  );
}

export default Signup;