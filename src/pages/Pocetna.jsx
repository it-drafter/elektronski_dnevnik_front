// import { useContext } from 'react';
import { useRef, useState, useEffect } from 'react';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import axios from 'axios';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
// import GlobalContext from '../context/global-context';

const Pocetna = () => {
  // const isLoggedIn = true;
  // const ctx = useContext(GlobalContext);

  const signIn = useSignIn();
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();
  const usernameRef = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMsg('');
  }, [username, password]);

  useEffect(() => {
    console.log('Logged in user:', auth?.name);
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(username, password);

    try {
      const response = await axios.post(
        `http://localhost:8080/dnevnik/login?user=${username}&password=${password}`
      );

      const { user, token } = response.data;

      signIn({
        auth: {
          token: token,
          type: 'Bearer',
        },
        // refresh: token
        userState: {
          name: user,
          uid: password,
        },
      });

      // const { user, token } = response.data;

      // Store the tokens in localStorage or secure cookie for later use
      // console.log('response.data.user:', user);
      // console.log('response.data.token:', token);

      // localStorage.setItem('user', response.data.user);
      // localStorage.setItem('token', response.data.token);

      // console.log('response.data: ', response);

      setUsername('');
      setPassword('');
    } catch (err) {
      console.log(err?.response?.status);
      // setError(err);
      if (!err?.response) {
        setErrorMsg('Server nedostupan');
      } else if (err?.response.status === 401) {
        setErrorMsg(
          'Pogrešni kredencijali. Proverite korisničko ime i lozinku.'
        );
      } else {
        setErrorMsg('Prijava nije uspela. Došlo je do nepoznate greške.');
      }
    }
  };

  if (errorMsg) {
    return <p>Greška: {errorMsg}</p>;
  }

  // console.log(auth?.user ? auth.user : 'nista');

  return (
    <article>
      {!isAuthenticated && <p>Pocetna - korisnik NIJE prijavljen.</p>}
      {isAuthenticated && <p>Pocetna - korisnik JE prijavljen. {auth?.name}</p>}
      {/* <p>User: {auth?.user}</p> */}

      <br />

      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>Korisničko ime: </label>
        <input
          type='text'
          id='username'
          ref={usernameRef}
          autoComplete='off'
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          required
        />

        <label htmlFor='password'>Lozinka: </label>
        <input
          type='password'
          id='password'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />

        <button>Sign In</button>
      </form>
    </article>
  );
};

export default Pocetna;
