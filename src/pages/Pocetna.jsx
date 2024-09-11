// import { useContext } from 'react';
import { useRef, useState, useEffect, useContext } from 'react';
// import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { postPrijava } from '../util/http';
import GlobalContext from '../context/global-context';
import { Button } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
// import GlobalContext from '../context/global-context';

const Pocetna = () => {
  // const isLoggedIn = true;
  // const ctx = useContext(GlobalContext);

  const signIn = useSignIn();
  // const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const usernameRef = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const globalCtx = useContext(GlobalContext);

  useEffect(() => {
    setErrorMsg('');
  }, [username, password]);

  useEffect(() => {
    // console.log('Logged in user:', auth?.name);
    // console.log('globalCtx.isLoggedInValue: ', globalCtx.isLoggedInValue);
  }, [auth, globalCtx.isLoggedInValue]);

  const handlePrijava = async (e) => {
    e.preventDefault();

    // console.log(username, password);

    try {
      const response = await postPrijava(username, password);

      // console.log(response.user, response.token);

      const { user, token, rola } = response.data;

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

      globalCtx.setIsLoggedInFn(true);
      globalCtx.setRolaKorisnikaFn(rola);

      setUsername('');
      setPassword('');
    } catch (err) {
      console.log('ERROR', err?.response?.status);
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
    return (
      <div>
        <p>Greška: {errorMsg}</p>

        <Button
          variant='outlined'
          onClick={() => {
            setErrorMsg(null);
          }}
          sx={{
            color: deepPurple[300],
            fontFamily: 'cursive',
            mt: '20px',
          }}
        >
          Nazad
        </Button>
      </div>
    );
  }

  return (
    <section>
      {!globalCtx.isLoggedInValue && <p>Pocetna - korisnik NIJE prijavljen.</p>}
      {globalCtx.isLoggedInValue && <p>Dobrodošli, {auth?.name} !</p>}
      {globalCtx.isLoggedInValue && (
        <p>Vaša rola: {globalCtx.rolaKorisnikaValue}</p>
      )}

      {/* <p>{authHeader}</p> */}

      <br />

      {globalCtx.isLoggedInValue === false && (
        <form onSubmit={handlePrijava}>
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
      )}
    </section>
  );
};

export default Pocetna;
