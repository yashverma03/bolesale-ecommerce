import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../config/config.js';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setSuccessMsg('Login Successfull');
        setEmail();
        setPassword();
        setErrorMsg();
        setTimeout(() => {
          setSuccessMsg('');
          navigate('/');
        }, 3000);
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };

  return (
    <div className='container' onSubmit={handleLogin}>
      <br />
      <br />
      <h1>Login</h1>
      <hr />
      {successMsg && (
        <>
          <div className='success-msg'> {successMsg} </div>
          <br />
        </>
      )}

      <form className='form-group' >
        <label>Email</label>
        <input type='email' className='form-control' required
          onChange={(e) => setEmail(e.target.value)} value={email} />
        <br />
        <label>Password</label>
        <input type='password' className='form-control' required
          onChange={(e) => setPassword(e.target.value)} value={password} />
        <br />

        <div className='btn-box'>
          <span>
            Don't have an account? Sign Up
            <Link to='/signup' className='link'> Here </Link>
            <button type='submit' className='btn btn-success btn-md'>LOGIN</button>
          </span>
        </div>
      </form>

      {errorMsg && (
        <>
          <br />
          <div className='error-msg'> {errorMsg} </div>
        </>
      )}
    </div>
  );
};

export default Login;
