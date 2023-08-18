import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, fs } from '../config/config.js';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const [fullName, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((credentials) => {
        console.log(fullName, email, password);
        console.log(credentials);

        setDoc(doc(fs, 'users', credentials.user.uid), {
          FullName: fullName,
          Email: email,
          Password: password
        })
          .then(() => {
            setSuccessMsg('Signup Successfull');
            setFullname('');
            setEmail();
            setPassword();
            setErrorMsg();
            setTimeout(() => {
              setSuccessMsg('');
              navigate('/login');
            }, 3000);
          })
          .catch((error) => {
            console.log(error);
            setErrorMsg(error.message);
          });
      })
      .catch((error) => {
        console.log(error);
        setErrorMsg(error.message);
      });
  };

  return (
    <div className='container'>
      <br />
      <br />
      <h1>Sign Up</h1>
      <hr />

      {successMsg && (
        <>
          <div className='success-msg'>{successMsg}</div>
        </>
      )}

      <form className='form-group' onSubmit={handleSignup}>
        <label>Full Name</label>
        <input type='text' className='form-control' required
          onChange={(e) => setFullname(e.target.value)} value={fullName} />
        <br />

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
            Already have an account Login?
            <Link to='/login' className='link'> Here </Link>
            <button type='submit' className='btn btn-success btn-md'>SIGN UP</button>
          </span>
        </div>
      </form>

      {errorMsg && (
        <>
          <div className='error-msg'>{errorMsg}</div>
        </>
      )}

    </div>
  );
};

export default Signup;
