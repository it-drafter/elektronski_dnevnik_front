import { Button, Stack, TextField, Typography } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import GlobalContext from '../context/global-context';
import { deepPurple, grey } from '@mui/material/colors';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../util/browserStorage';
import { postPredmeti } from '../util/http';
import { useImmer } from 'use-immer';

const DodavanjePredmeta = () => {
  const auth = useAuthUser();
  const globalCtx = useContext(GlobalContext);
  const nav = useNavigate();

  const nazivPredmetaInputRef = useRef();
  const sifraPredmetaInputRef = useRef();
  const opisPredmetaInputRef = useRef();
  const nedeljniFondCasovaInputRef = useRef();

  const [hasPermission, setHasPermission] = useState(false);

  const [invalidNazivPredmeta, updateInvalidNazivPredmeta] = useImmer([
    false,
    null,
  ]);
  const [invalidSifraPredmeta, updateInvalidSifraPredmeta] = useImmer([
    false,
    null,
  ]);
  const [invalidOpisPredmeta, updateInvalidOpisPredmeta] = useImmer([
    false,
    null,
  ]);
  const [invalidNedeljniFondCasova, setInvalidNedeljniFondCasova] =
    useState(false);

  useEffect(() => {
    if (auth?.role === 'ROLA_ADMINISTRATOR') {
      setHasPermission(true);
    }
  }, []);

  if (!hasPermission) {
    return <section>Nemate ovlašćenje da pristupite ovoj stranici.</section>;
  }

  const validateInput = () => {
    let isValid = true;

    if (nazivPredmetaInputRef.current.value.trim().length === 0) {
      updateInvalidNazivPredmeta((draft) => [
        true,
        'Naziv predmeta ne sme biti prazan!',
      ]);
      isValid = false;
    }

    if (nazivPredmetaInputRef.current.value.trim().length > 25) {
      updateInvalidNazivPredmeta((draft) => [
        true,
        'Naziv predmeta može imati maksimalno 25 karaktera!',
      ]);
      isValid = false;
    }

    if (sifraPredmetaInputRef.current.value.trim().length === 0) {
      updateInvalidSifraPredmeta((draft) => [
        true,
        'Šifra predmeta ne sme biti prazna!',
      ]);
      isValid = false;
    }

    if (sifraPredmetaInputRef.current.value.trim().length > 10) {
      updateInvalidSifraPredmeta((draft) => [
        true,
        'Šifra predmeta može imati maksimalno 10 karaktera!',
      ]);
      isValid = false;
    }

    if (opisPredmetaInputRef.current.value.trim().length === 0) {
      updateInvalidOpisPredmeta((draft) => [
        true,
        'Opis predmeta ne sme biti prazan!',
      ]);
      isValid = false;
    }

    if (opisPredmetaInputRef.current.value.trim().length > 50) {
      updateInvalidOpisPredmeta((draft) => [
        true,
        'Opis predmeta može imati maksimalno 10 karaktera!',
      ]);
      isValid = false;
    }

    if (
      nedeljniFondCasovaInputRef.current.value.trim().length === 0 ||
      /^\d+$/.test(nedeljniFondCasovaInputRef.current.value.trim()) === false
    ) {
      setInvalidNedeljniFondCasova(true);
      isValid = false;
    }

    return isValid;
  };

  const submitHandler = async () => {
    // console.log('SUBMIT CLICKED', nazivPredmetaInputRef.current.value);
    if (validateInput()) {
      console.log('Pozovi HTTP post metodu da sacuvas novi predmet!');

      if (getToken()) {
        const response = await postPredmeti('Bearer ' + getToken(), {
          nazivPredmeta: nazivPredmetaInputRef.current.value.trim(),
          sifraPredmeta: sifraPredmetaInputRef.current.value.trim(),
          opisPredmeta: opisPredmetaInputRef.current.value.trim(),
          nedeljniFondCasova: Number(
            nedeljniFondCasovaInputRef.current.value.trim()
          ),
        });
        console.log('RESPONSE od servera', response);
      }

      nazivPredmetaInputRef.current.value = '';
      sifraPredmetaInputRef.current.value = '';
      opisPredmetaInputRef.current.value = '';
      nedeljniFondCasovaInputRef.current.value = '';
    }
  };

  return (
    <section>
      <Typography
        variant='h5'
        align='center'
        sx={{ fontFamily: globalCtx.fontFamilyValue, mb: 4 }}
      >
        Dodavanje novog predmeta
      </Typography>

      <Stack direction='column' gap='20px' alignItems='center'>
        <TextField
          label='Naziv predmeta'
          variant='outlined'
          color='secondary'
          inputRef={nazivPredmetaInputRef}
          onFocus={() => updateInvalidNazivPredmeta((draft) => [false, null])}
          error={invalidNazivPredmeta[0]}
          helperText={invalidNazivPredmeta[0] ? invalidNazivPredmeta[1] : null}
          sx={{
            width: '100%',
            '& fieldset': { border: 'none' },
            '& .MuiFormLabel-root': {
              color: invalidNazivPredmeta[0]
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
          label='Šifra predmeta'
          variant='outlined'
          color='secondary'
          inputRef={sifraPredmetaInputRef}
          onFocus={() => updateInvalidSifraPredmeta((draft) => [false, null])}
          error={invalidSifraPredmeta[0]}
          helperText={invalidSifraPredmeta[0] ? invalidSifraPredmeta[1] : null}
          sx={{
            width: '100%',
            '& fieldset': { border: 'none' },
            '& .MuiFormLabel-root': {
              color: invalidSifraPredmeta[0]
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
          label='Opis predmeta'
          variant='outlined'
          color='secondary'
          inputRef={opisPredmetaInputRef}
          onFocus={() => updateInvalidOpisPredmeta((draft) => [false, null])}
          error={invalidOpisPredmeta[0]}
          helperText={invalidOpisPredmeta[0] ? invalidOpisPredmeta[1] : null}
          sx={{
            width: '100%',
            '& fieldset': { border: 'none' },
            '& .MuiFormLabel-root': {
              color: invalidOpisPredmeta[0]
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
          label='Nedeljni fond časova'
          variant='outlined'
          color='secondary'
          inputRef={nedeljniFondCasovaInputRef}
          onFocus={() => setInvalidNedeljniFondCasova(false)}
          sx={{
            width: '100%',
            '& fieldset': { border: 'none' },
            '& .MuiFormLabel-root': {
              color: invalidNedeljniFondCasova
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

        <Stack
          direction='row'
          sx={{
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '10px',
          }}
        >
          <Button
            variant='outlined'
            startIcon={<CancelIcon />}
            onClick={() => nav('/predmeti')}
            sx={{
              color: deepPurple[300],
              fontFamily: globalCtx.fontFamilyValue,
              borderRadius: '15px',
            }}
            disabled={globalCtx.isLoggedInValue ? false : true}
          >
            Odustani
          </Button>

          <Button
            variant='outlined'
            startIcon={<AddCircleIcon />}
            onClick={submitHandler}
            sx={{
              color: deepPurple[300],
              fontFamily: globalCtx.fontFamilyValue,
              borderRadius: '15px',
            }}
            disabled={globalCtx.isLoggedInValue ? false : true}
          >
            Dodaj
          </Button>
        </Stack>
      </Stack>
    </section>
  );
};

export default DodavanjePredmeta;
