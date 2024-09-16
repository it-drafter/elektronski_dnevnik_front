import { useRef, useState, useEffect, useContext } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { getRukovanjeSecured, postPrijava } from '../util/http';
import GlobalContext from '../context/global-context';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { deepPurple, grey } from '@mui/material/colors';
import { getToken } from '../util/browserStorage';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useImmer } from 'use-immer';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';

const Pocetna = () => {
  const signIn = useSignIn();
  const signOut = useSignOut();
  const auth = useAuthUser();
  const globalCtx = useContext(GlobalContext);

  const korisnickoImeInputRef = useRef();
  const lozinkaInputRef = useRef();

  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [invalidKorisnickoIme, updateInvalidKorisnickoIme] = useImmer([
    false,
    null,
  ]);
  const [invalidLozinka, updateInvalidLozinka] = useImmer([false, null]);

  useEffect(() => {
    const validateExistingToken = async () => {
      if (globalCtx.isLoggedInValue) {
        try {
          await getRukovanjeSecured('Bearer ' + getToken());
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

  const validateInput = () => {
    let isValid = true;

    if (korisnickoImeInputRef.current.value.trim().length === 0) {
      updateInvalidKorisnickoIme((draft) => [
        true,
        'Korisničko ime ne sme biti prazno!',
      ]);
      isValid = false;
    }

    if (lozinkaInputRef.current.value.trim().length === 0) {
      updateInvalidLozinka((draft) => [true, 'Lozinka ne sme biti prazna!']);
      isValid = false;
    }

    return isValid;
  };

  // Password field begin:
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  // Password field end:

  const handlePrijava = async (e) => {
    // e.preventDefault();

    if (validateInput()) {
      try {
        const response = await postPrijava(
          korisnickoImeInputRef.current.value.trim(),
          lozinkaInputRef.current.value.trim()
        );

        const { user, token, rola } = response.data;

        signIn({
          auth: {
            token: token,
            type: 'Bearer',
          },
          userState: {
            name: user,
            uid: lozinkaInputRef.current.value.trim(),
            role: rola,
          },
        });

        globalCtx.setIsLoggedInFn(true);

        // setUsername('');
        // setPassword('');
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

      korisnickoImeInputRef.current.value = '';
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
            fontFamily: { fontFamily: globalCtx.fontFamilyValue },
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

  let rolaDisplay = '';

  switch (auth?.role) {
    case 'ROLA_ADMINISTRATOR':
      rolaDisplay = 'Administrator';
      break;
    case 'ROLA_NASTAVNIK':
      rolaDisplay = 'Nastavnik';
      break;
    case 'ROLA_RODITELJ':
      rolaDisplay = 'Roditelj';
      break;
    case 'ROLA_UCENIK':
      rolaDisplay = 'Učenik';
      break;
    default:
      rolaDisplay = '';
      break;
  }

  return (
    <section>
      <Typography
        variant='h5'
        align='center'
        sx={{ fontFamily: globalCtx.fontFamilyValue, mb: 4 }}
      >
        Početna
      </Typography>

      <Typography
        variant='h6'
        align='left'
        sx={{ fontFamily: globalCtx.fontFamilyValue, mb: 4 }}
      >
        {!globalCtx.isLoggedInValue && 'Ulogujte se'}
      </Typography>

      <Typography
        variant='h6'
        align='left'
        sx={{ fontFamily: globalCtx.fontFamilyValue, mb: 4 }}
      >
        {globalCtx.isLoggedInValue && `Dobrodošli, ${auth?.name} !`}
      </Typography>

      <Typography
        variant='h6'
        align='left'
        sx={{ fontFamily: globalCtx.fontFamilyValue, mb: 4 }}
      >
        {globalCtx.isLoggedInValue &&
          `Ulogovani ste sa korisničkom rolom: ${rolaDisplay}`}
      </Typography>

      {globalCtx.isLoggedInValue === false && (
        <Stack direction='column' gap='20px' alignItems='left'>
          <TextField
            label='Korisničko ime'
            variant='outlined'
            color='secondary'
            required
            inputRef={korisnickoImeInputRef}
            onFocus={() => updateInvalidKorisnickoIme((draft) => [false, null])}
            error={invalidKorisnickoIme[0]}
            helperText={
              invalidKorisnickoIme[0] ? invalidKorisnickoIme[1] : null
            }
            sx={{
              width: '70%',
              '& fieldset': { border: 'none' },
              '& .MuiFormLabel-root': {
                color: invalidKorisnickoIme[0]
                  ? 'red!important'
                  : deepPurple[200] + '!important',
                fontFamily: globalCtx.fontFamilyValue + '!important',
              },
              input: {
                color: grey['A100'],
                borderRadius: '15px',
                height: '22px',
                marginTop: '10px',
                border: '1px solid #9575cd',
              },
            }}
          />

          <TextField
            label='Lozinka'
            variant='outlined'
            color='secondary'
            type={showPassword ? 'text' : 'password'}
            required
            inputRef={lozinkaInputRef}
            onFocus={() => updateInvalidLozinka((draft) => [false, null])}
            error={invalidLozinka[0]}
            helperText={invalidLozinka[0] ? invalidLozinka[1] : null}
            sx={{
              width: '70%',
              '& fieldset': { border: 'none' },
              '& .MuiFormLabel-root': {
                color: invalidLozinka[0]
                  ? 'red!important'
                  : deepPurple[200] + '!important',
                fontFamily: globalCtx.fontFamilyValue + '!important',
              },
              input: {
                color: grey['A100'],
                borderRadius: '15px',
                height: '22px',
                marginTop: '10px',
                border: '1px solid #9575cd',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge='end'
                    sx={{ color: deepPurple[200] }}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant='outlined'
            startIcon={<LoginIcon />}
            onClick={handlePrijava}
            sx={{
              color: deepPurple[300],
              fontFamily: globalCtx.fontFamilyValue,
              borderRadius: '15px',
              width: '25%',
            }}
          >
            Prijava
          </Button>
        </Stack>
      )}

      {/* {globalCtx.isLoggedInValue === false && (
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
      )} */}
    </section>
  );
};

export default Pocetna;
