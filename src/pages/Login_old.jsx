import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import '../css/login.css';

const Login = () => {
  const userRef = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(username, password);

    try {
      const response = await axios.post(
        `http://localhost:8080/dnevnik/login?user=${username}&password=${password}`
      );

      const { user, token } = response.data;

      // Store the tokens in localStorage or secure cookie for later use
      console.log('response.data.user:', user);
      console.log('response.data.token:', token);
      // localStorage.setItem('user', response.data.user);
      // localStorage.setItem('token', response.data.token);

      console.log(response.data);

      setUsername('');
      setPassword('');
      setSuccess(true);
    } catch (err) {
      console.log(err);
      // if (!err?.response) {
      //   setErrMsg('No Server Response');
      // } else if (err.response?.status === 400) {
      //   setErrMsg('Missing Username or Password');
      // } else if (err.response?.status === 401) {
      //   setErrMsg('Unauthorized');
      // } else {
      //   setErrMsg('Login Failed');
      // }
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>You are logged in!</h1>
          <br />
          <p>
            <a href='#'>Go to Home</a>
          </p>
        </section>
      ) : (
        <section>
          <p className={errMsg ? 'errmsg' : 'offscreen'}>{errMsg}</p>

          <h1>Sign In</h1>

          <form onSubmit={handleSubmit}>
            <label htmlFor='username'>Username: </label>
            <input
              type='text'
              id='username'
              ref={userRef}
              autoComplete='off'
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
            />

            <label htmlFor='password'>Password: </label>
            <input
              type='password'
              id='password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />

            <button>Sign In</button>
          </form>
        </section>
      )}
    </>
  );
};

export default Login;
