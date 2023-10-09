import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwdA, setPwdA] = useState('');
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [pNo, setPNo] = useState('');
  const onSubmit = (data) => console.log(data);
  const handleSignup = (e) => {
    e.preventDefault();

    if (pwd !== pwdA) {
        setError('Passwords do not match.');
        return;
    }

    const customer = {
        csm_id: id,
        csm_pwd: pwd,
        csm_pwdA: pwdA,
        csm_name: name,
        csm_pNo: pNo,
        csm_birth: birth,
        csm_email: email
    };

    setLoading(true);

    fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
    })
    .then(response => response.json())
    .then(data => {
        setLoading(false);

        if (data.success) {
            navigate('/'); // 가입 후 리다이렉션 할 경로
        } else {
            setError(data.error);
        }
    })
    .catch(err => {
        setLoading(false);
        setError('Something went wrong.');
    });
};

  return (
    <div className="signup-form">
      
        <h1>회원가입</h1>

        <form onSubmit={handleSignup}>
        <input
          name="name"
          value={name}
          placeholder="이름"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          name="id"
          value={id}
          placeholder="아이디"
          onChange={(e) => setId(e.target.value)}
        />
        <input
          name="pwd"
          value={pwd}
          type='password'
          placeholder="비밀번호"
          onChange={(e) => setPwd(e.target.value)}
        />
         <input
          name="pwdA"
          value={pwdA}
          type='password'
          placeholder="비밀번호 확인"
          onChange={(e) => setPwdA(e.target.value)}
        />
        {pwd !== pwdA && <p>비밀번호가 일치하지 않습니다.</p>}
          <input
          name="birth"
          value={birth}
          placeholder="생년월일(6자리)"
          onChange={(e) => setBirth(e.target.value)}
        />
        <input
          name="email"
          value={email}
          placeholder="이메일"
          onChange={(e) => setEmail(e.target.value)}
        />  
          <input
          name="pNo"
          value={pNo}
          placeholder="전화번호"
          onChange={(e) => setPNo(e.target.value)}
        />  
        
        {error && <div className="error">{error}</div>}
        
        <button disabled={loading} onClick={handleSignup}>
          {loading ? 'Signing up...' : '회원가입'}
        </button>

        <Link to="/" className="signup-link">Go back to main page</Link>
        </form>
    </div>
  );
}
//https : //HTTPS=true SSL_CRT_FILE=localhost.pem SSL_KEY_FILE=localhost-key.pem
export default Signup;

