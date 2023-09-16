import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = () => {
    setLoading(true);
    // Add your signup logic here
    // ...

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/', { replace: true });
    }, 2000);
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h1>회원가입</h1>
        <label htmlFor="username">Username <span className="required">*</span></label>
        <input id="username" type="text" placeholder="Username" />
        
        <label htmlFor="email">Email <span className="required">*</span></label>
        <input id="email" type="email" placeholder="Email" />
        
        <label htmlFor="password">Password <span className="required">*</span></label>
        <input id="password" type="password" placeholder="Password" />
        
        {error && <div className="error">{error}</div>}
        
        <button disabled={loading} onClick={handleSignup}>
          {loading ? 'Signing up...' : '회원가입'}
        </button>

        <Link to="/" className="signup-link">Go back to main page</Link>
      </div>
    </div>
  );
}

export default Signup;
