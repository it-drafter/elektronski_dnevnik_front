import { useRef, useState, useEffect, useContext } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { getRukovanje, postPrijava } from '../util/http';
import GlobalContext from '../context/global-context';
import { Box, Button, CircularProgress } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { getToken } from '../util/browserStorage';
import useSignOut from 'react-auth-kit/hooks/useSignOut';

const Pocetna = () => {
  const signIn = useSignIn();
  const signOut = useSignOut();
  const auth = useAuthUser();
  const usernameRef = useRef();
  const globalCtx = useContext(GlobalContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateExistingToken = async () => {
      if (globalCtx.isLoggedInValue) {
        try {
          await getRukovanje('Bearer ' + getToken());
          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
          console.log('Sesija istekla - izloguj korisnika samo na frontu', err);
          signOut();
          globalCtx.setIsLoggedInFn(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    validateExistingToken();
  }, []);

  const handlePrijava = async (e) => {
    e.preventDefault();

    try {
      const response = await postPrijava(username, password);

      const { user, token, rola } = response.data;

      signIn({
        auth: {
          token: token,
          type: 'Bearer',
        },
        userState: {
          name: user,
          uid: password,
          role: rola,
        },
      });

      globalCtx.setIsLoggedInFn(true);

      setUsername('');
      setPassword('');
    } catch (err) {
      console.log('ERROR', err?.response?.status);
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

  if (isLoading) {
    return (
      <div className='whole-page-flex-container'>
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  return (
    <section>
      {!globalCtx.isLoggedInValue && <p>Pocetna - korisnik NIJE prijavljen.</p>}
      {globalCtx.isLoggedInValue && <p>Dobrodošli, {auth?.name} !</p>}
      {globalCtx.isLoggedInValue && (
        <>
          <p>Vaša rola: {auth?.role}</p>
        </>
      )}

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
