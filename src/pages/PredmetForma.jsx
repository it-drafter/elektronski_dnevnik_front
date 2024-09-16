import { Button, Stack, TextField, Typography } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import GlobalContext from '../context/global-context';
import { deepPurple, grey } from '@mui/material/colors';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useLocation, useNavigate } from 'react-router-dom';
import { getToken } from '../util/browserStorage';
import { useImmer } from 'use-immer';
import { postPredmeti, putPredmeti } from '../util/http';

const PredmetForma = () => {
  const auth = useAuthUser();

  const globalCtx = useContext(GlobalContext);
  const nav = useNavigate();
  const location = useLocation();

  const nazivPredmetaInputRef = useRef();
  const sifraPredmetaInputRef = useRef();
  const opisPredmetaInputRef = useRef();
  const nedeljniFondCasovaInputRef = useRef();

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
  const [invalidNedeljniFondCasova, updateInvalidNedeljniFondCasova] = useImmer(
    [false, null]
  );

  const [hasPermission, setHasPermission] = useState(false);
  const [isSuccessfullyAdded, setIsSuccessfullyAdded] = useState(false);
  const [isSuccessfullyModified, setIsSuccessfullyModified] = useState(false);

  useEffect(() => {
    if (auth?.role === 'ROLA_ADMINISTRATOR') {
      setHasPermission(true);
    }
  }, []);

  useEffect(() => {
    let timeout1;

    if (isSuccessfullyAdded) {
      timeout1 = setTimeout(() => {
        setIsSuccessfullyAdded(false);

        nav('/predmeti');
      }, 2000);
    }

    return () => {
      clearTimeout(timeout1);
    };
  }, [isSuccessfullyAdded]);

  useEffect(() => {
    let timeout2;

    if (isSuccessfullyModified) {
      timeout2 = setTimeout(() => {
        setIsSuccessfullyModified(false);

        nav('/predmeti');
      }, 2000);
    }

    return () => {
      clearTimeout(timeout2);
    };
  }, [isSuccessfullyModified]);

  useEffect(() => {
    let timeout3;

    timeout3 = setTimeout(() => {
      if (nazivPredmetaInputRef.current) {
        nazivPredmetaInputRef.current.focus();
      }
    }, 300);

    return () => {
      clearTimeout(timeout3);
    };
  }, []);

  const validateInput = () => {
    let isValid = true;

    if (nazivPredmetaInputRef.current.value.trim().length === 0) {
      updateInvalidNazivPredmeta((draft) => [
        true,
        'Naziv predmeta ne sme biti prazan!',
      ]);
      isValid = false;
    } else if (nazivPredmetaInputRef.current.value.trim().length > 25) {
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
    } else if (sifraPredmetaInputRef.current.value.trim().length > 25) {
      updateInvalidSifraPredmeta((draft) => [
        true,
        'Šifra predmeta može imati maksimalno 25 karaktera!',
      ]);
      isValid = false;
    }

    if (opisPredmetaInputRef.current.value.trim().length === 0) {
      updateInvalidOpisPredmeta((draft) => [
        true,
        'Opis predmeta ne sme biti prazan!',
      ]);
      isValid = false;
    } else if (opisPredmetaInputRef.current.value.trim().length > 35) {
      updateInvalidOpisPredmeta((draft) => [
        true,
        'Opis predmeta može imati maksimalno 35 karaktera!',
      ]);
      isValid = false;
    }

    if (nedeljniFondCasovaInputRef.current.value.trim().length === 0) {
      updateInvalidNedeljniFondCasova((draft) => [
        true,
        'Nedeljni fond časova ne sme biti prazan!',
      ]);
      isValid = false;
    } else if (
      nedeljniFondCasovaInputRef.current.value.trim() < 1 ||
      nedeljniFondCasovaInputRef.current.value.trim() > 20 ||
      !Number.isInteger(Number(nedeljniFondCasovaInputRef.current.value.trim()))
    ) {
      updateInvalidNedeljniFondCasova((draft) => [
        true,
        'Nedeljni fond časova mora biti ceo broj od 1 do 20!',
      ]);
      isValid = false;
    }

    return isValid;
  };

  const submitHandler = async () => {
    if (validateInput()) {
      const payload = {
        nazivPredmeta: nazivPredmetaInputRef.current.value.trim(),
        sifraPredmeta: sifraPredmetaInputRef.current.value.trim(),
        opisPredmeta: opisPredmetaInputRef.current.value.trim(),
        nedeljniFondCasova: Number(
          nedeljniFondCasovaInputRef.current.value.trim()
        ),
      };

      if (getToken()) {
        let response;

        if (!location.state.isEditMode) {
          response = await postPredmeti('Bearer ' + getToken(), payload);
        }

        if (location.state.isEditMode) {
          response = await putPredmeti(
            'Bearer ' + getToken(),
            payload,
            location.state.predmet.id
          );
        }
      }

      nazivPredmetaInputRef.current.value = '';
      sifraPredmetaInputRef.current.value = '';
      opisPredmetaInputRef.current.value = '';
      nedeljniFondCasovaInputRef.current.value = '';

      location.state.isEditMode
        ? setIsSuccessfullyModified(true)
        : setIsSuccessfullyAdded(true);
    }
  };

  if (!hasPermission) {
    return <section>Nemate ovlašćenje da pristupite ovoj stranici.</section>;
  }

  return (
    <section>
      <Typography
        variant='h5'
        align='center'
        sx={{ fontFamily: globalCtx.fontFamilyValue, mb: 4 }}
      >
        {location.state.isEditMode
          ? 'Izmena predmeta'
          : 'Dodavanje novog predmeta'}
      </Typography>

      <Stack direction='column' gap='20px' alignItems='center'>
        <TextField
          label='Naziv predmeta'
          variant='outlined'
          color='secondary'
          required
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
          defaultValue={
            location.state.isEditMode
              ? location.state.predmet.nazivPredmeta
              : null
          }
        />
        <TextField
          label='Šifra predmeta'
          variant='outlined'
          color='secondary'
          required
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
          defaultValue={
            location.state.isEditMode
              ? location.state.predmet.sifraPredmeta
              : null
          }
        />
        <TextField
          label='Opis predmeta'
          variant='outlined'
          color='secondary'
          required
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
          defaultValue={
            location.state.isEditMode
              ? location.state.predmet.opisPredmeta
              : null
          }
        />

        <TextField
          label='Nedeljni fond časova'
          variant='outlined'
          color='secondary'
          required
          type='number'
          inputRef={nedeljniFondCasovaInputRef}
          onFocus={() =>
            updateInvalidNedeljniFondCasova((draft) => [false, null])
          }
          error={invalidNedeljniFondCasova[0]}
          helperText={
            invalidNedeljniFondCasova[0] ? invalidNedeljniFondCasova[1] : null
          }
          sx={{
            width: '100%',
            '& fieldset': { border: 'none' },
            '& .MuiFormLabel-root': {
              color: invalidNedeljniFondCasova[0]
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
            inputProps: { min: 1, max: 10, step: 1 },
          }}
          defaultValue={
            location.state.isEditMode
              ? location.state.predmet.nedeljniFondCasova
              : null
          }
        />

        <Stack
          direction='row'
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
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
          >
            Odustani
          </Button>

          <Typography
            sx={{ fontFamily: globalCtx.fontFamilyValue, color: 'green' }}
          >
            {`${isSuccessfullyAdded ? 'Predmet dodat!' : ''}`}
            {`${isSuccessfullyModified ? 'Predmet izmenjen!' : ''}`}
          </Typography>

          <Button
            variant='outlined'
            startIcon={<AddCircleIcon />}
            onClick={submitHandler}
            sx={{
              color: deepPurple[300],
              fontFamily: globalCtx.fontFamilyValue,
              borderRadius: '15px',
            }}
          >
            {location.state.isEditMode ? 'Izmeni' : 'Dodaj'}
          </Button>
        </Stack>
      </Stack>
    </section>
  );
};

export default PredmetForma;
