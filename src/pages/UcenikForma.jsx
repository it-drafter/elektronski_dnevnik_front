import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import GlobalContext from '../context/global-context';
import { deepPurple, grey } from '@mui/material/colors';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useLocation, useNavigate } from 'react-router-dom';
import { getToken } from '../util/browserStorage';
import { useImmer } from 'use-immer';
import {
  getOdeljenja,
  getRoditelji,
  postUcenici,
  putUcenici,
} from '../util/http';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const UcenikForma = () => {
  const auth = useAuthUser();

  const globalCtx = useContext(GlobalContext);
  const nav = useNavigate();
  const location = useLocation();

  const imeUcenikaInputRef = useRef();
  const prezimeUcenikaInputRef = useRef();
  const jmbgUcenikaInputRef = useRef();
  const adresaStanovanjaInputRef = useRef();
  const brojTelefonaInputRef = useRef();
  const korisnickoImeInputRef = useRef();
  const lozinkaInputRef = useRef();
  // const odeljenjeInputRef = useRef();

  const [invalidImeUcenika, updateInvalidImeUcenika] = useImmer([false, null]);
  const [invalidPrezimeUcenika, updateInvalidPrezimeUcenika] = useImmer([
    false,
    null,
  ]);
  const [invalidJmbgUcenika, updateInvalidJmbgUcenika] = useImmer([
    false,
    null,
  ]);
  const [invalidAdresaStanovanja, updateInvalidAdresaStanovanja] = useImmer([
    false,
    null,
  ]);
  const [invalidBrojTelefona, updateInvalidBrojTelefona] = useImmer([
    false,
    null,
  ]);
  const [invalidKorisnickoIme, updateInvalidKorisnickoIme] = useImmer([
    false,
    null,
  ]);
  const [invalidLozinka, updateInvalidLozinka] = useImmer([false, null]);
  const [invalidOdeljenje, setInvalidOdeljenje] = useState(false);
  const [invalidRoditelj, setInvalidRoditelj] = useState(false);

  const [hasPermission, setHasPermission] = useState(false);
  const [isSuccessfullyAdded, setIsSuccessfullyAdded] = useState(false);
  const [isSuccessfullyModified, setIsSuccessfullyModified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [odeljenjaList, setOdeljenjaList] = useState([]);
  const [roditeljiList, setRoditeljiList] = useState([]);
  const [openOdeljenje, setOpenOdeljenje] = useState(false);
  const [openRoditelj, setOpenRoditelj] = useState(false);
  const [odeljenje, setOdeljenje] = useState(
    location.state.isEditMode ? location.state.ucenik.odeljenje.id : ''
  );
  const [roditelj, setRoditelj] = useState(
    location.state.isEditMode ? location.state.ucenik.roditelj.id : ''
  );

  useEffect(() => {
    // console.log('location', location.state.ucenik);
    if (auth?.role === 'ROLA_ADMINISTRATOR') {
      setHasPermission(true);
    }
  }, []);

  useEffect(() => {
    let timeout1;

    if (isSuccessfullyAdded) {
      timeout1 = setTimeout(() => {
        setIsSuccessfullyAdded(false);

        nav('/ucenici');
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

        nav('/ucenici');
      }, 2000);
    }

    return () => {
      clearTimeout(timeout2);
    };
  }, [isSuccessfullyModified]);

  useEffect(() => {
    let timeout3;

    timeout3 = setTimeout(() => {
      if (imeUcenikaInputRef.current) {
        imeUcenikaInputRef.current.focus();
      }
    }, 300);

    return () => {
      clearTimeout(timeout3);
    };
  }, []);

  useEffect(() => {
    const fetchOdeljenja = async () => {
      const response = await getOdeljenja('Bearer ' + getToken());
      setOdeljenjaList(response.data);
      // console.log(response.data);
    };

    fetchOdeljenja();
  }, []);

  useEffect(() => {
    const fetchRoditelji = async () => {
      const response = await getRoditelji('Bearer ' + getToken());
      setRoditeljiList(response.data);
      // console.log(response.data);
    };

    fetchRoditelji();
  }, []);

  const validateInput = () => {
    let isValid = true;

    if (imeUcenikaInputRef.current.value.trim().length === 0) {
      updateInvalidImeUcenika((draft) => [
        true,
        'Ime učenika ne sme biti prazno!',
      ]);
      isValid = false;
    } else if (imeUcenikaInputRef.current.value.trim().length > 25) {
      updateInvalidImeUcenika((draft) => [
        true,
        'Ime učenika može imati maksimalno 25 karaktera!',
      ]);
      isValid = false;
    }

    if (prezimeUcenikaInputRef.current.value.trim().length === 0) {
      updateInvalidPrezimeUcenika((draft) => [
        true,
        'Prezime učenika ne sme biti prazno!',
      ]);
      isValid = false;
    } else if (prezimeUcenikaInputRef.current.value.trim().length > 25) {
      updateInvalidPrezimeUcenika((draft) => [
        true,
        'Prezime učenika može imati maksimalno 25 karaktera!',
      ]);
      isValid = false;
    }

    if (jmbgUcenikaInputRef.current.value.trim().length === 0) {
      updateInvalidJmbgUcenika((draft) => [
        true,
        'JMBG učenika ne sme biti prazan!',
      ]);
      isValid = false;
    } else if (
      jmbgUcenikaInputRef.current.value.trim().length !== 13 ||
      !/^\d+$/.test(jmbgUcenikaInputRef.current.value.trim())
    ) {
      updateInvalidJmbgUcenika((draft) => [
        true,
        'JMBG učenika mora imati tačno 13 numeričkih karaktera!',
      ]);
      isValid = false;
    }

    if (adresaStanovanjaInputRef.current.value.trim().length === 0) {
      updateInvalidAdresaStanovanja((draft) => [
        true,
        'Adresa stanovanja učenika ne sme biti prazna!',
      ]);
      isValid = false;
    } else if (adresaStanovanjaInputRef.current.value.trim().length > 35) {
      updateInvalidAdresaStanovanja((draft) => [
        true,
        'Adresa stanovanja učenika može imati maksimalno 35 karaktera!',
      ]);
      isValid = false;
    }

    if (brojTelefonaInputRef.current.value.trim().length === 0) {
      updateInvalidBrojTelefona((draft) => [
        true,
        'Broj telefona učenika ne sme biti prazan!',
      ]);
      isValid = false;
    } else if (/[a-zA-Z]/g.test(brojTelefonaInputRef.current.value.trim())) {
      updateInvalidBrojTelefona((draft) => [
        true,
        'Broj telefona učenika ne sme sadržati slova!',
      ]);
      isValid = false;
    }

    if (korisnickoImeInputRef.current.value.trim().length === 0) {
      updateInvalidKorisnickoIme((draft) => [
        true,
        'Korisničko ime ne sme biti prazno!',
      ]);
      isValid = false;
    } else if (
      korisnickoImeInputRef.current.value.trim().length > 25 ||
      korisnickoImeInputRef.current.value.trim().length < 8
    ) {
      updateInvalidKorisnickoIme((draft) => [
        true,
        'Korisničko ime mora imati između 8 i 25 karaktera!',
      ]);
      isValid = false;
    }

    if (
      lozinkaInputRef.current.value.trim().length === 0 &&
      !location.state.isEditMode
    ) {
      updateInvalidLozinka((draft) => [true, 'Lozinka ne sme biti prazna!']);
      isValid = false;
    } else if (
      lozinkaInputRef.current.value.trim().length > 0 &&
      (lozinkaInputRef.current.value.trim().length > 25 ||
        lozinkaInputRef.current.value.trim().length < 4)
    ) {
      updateInvalidLozinka((draft) => [
        true,
        'Lozinka mora imati između 4 i 25 karaktera!',
      ]);
      isValid = false;
    }

    if (!odeljenje) {
      setInvalidOdeljenje(true);
      isValid = false;
    }

    if (!roditelj) {
      setInvalidRoditelj(true);
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

  // Select list begin:
  const handleChangeOdeljenje = (event) => {
    setOdeljenje(Number(event.target.value) || '');
  };

  const handleChangeRoditelj = (event) => {
    setRoditelj(Number(event.target.value) || '');
  };

  const handleClickOpenOdeljenje = () => {
    setOpenOdeljenje(true);
  };

  const handleClickOpenRoditelj = () => {
    setOpenRoditelj(true);
  };

  const handleCloseOdeljenje = (event, reason) => {
    // console.log('close reason', reason);s
    if (reason !== 'backdropClick') {
      setOpenOdeljenje(false);

      if (reason === 'cancel') {
        setOdeljenje(
          location.state.isEditMode ? location.state.ucenik.odeljenje.id : ''
        );
      }
    }
  };

  const handleCloseRoditelj = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpenRoditelj(false);

      if (reason === 'cancel') {
        setRoditelj(
          location.state.isEditMode ? location.state.ucenik.roditelj.id : ''
        );
      }
    }
  };
  // Select list end:

  const submitHandler = async () => {
    // console.log('SUBMIT CLICKED', odeljenjeInputRef);
    // console.log(
    //   'SUBMIT CLICKED1',
    //   typeof imeUcenikaInputRef.current.value.trim()
    // );
    if (validateInput()) {
      let payload;

      payload = {
        jmbg: jmbgUcenikaInputRef.current.value.trim(),
        korisnik: {
          ime: imeUcenikaInputRef.current.value.trim(),
          prezime: prezimeUcenikaInputRef.current.value.trim(),
          adresaStanovanja: adresaStanovanjaInputRef.current.value.trim(),
          brojTelefona: brojTelefonaInputRef.current.value.trim(),
          korisnickoIme: korisnickoImeInputRef.current.value.trim(),
          lozinka:
            lozinkaInputRef.current.value.trim() === 0
              ? null
              : lozinkaInputRef.current.value.trim().length === 0,
        },
        odeljenje: {
          id: odeljenje,
        },
        roditelj: {
          id: roditelj,
        },
      };

      console.log('payload click', payload);

      if (getToken()) {
        let response;

        if (!location.state.isEditMode) {
          response = await postUcenici('Bearer ' + getToken(), payload);
        }

        if (location.state.isEditMode) {
          response = await putUcenici(
            'Bearer ' + getToken(),
            payload,
            location.state.ucenik.id
          );
        }

        console.log('RESPONSE od servera', response);
      }

      imeUcenikaInputRef.current.value = '';
      prezimeUcenikaInputRef.current.value = '';
      jmbgUcenikaInputRef.current.value = '';
      adresaStanovanjaInputRef.current.value = '';
      brojTelefonaInputRef.current.value = '';
      korisnickoImeInputRef.current.value = '';
      lozinkaInputRef.current.value = '';
      setOdeljenje('');
      setRoditelj('');

      location.state.isEditMode
        ? setIsSuccessfullyModified(true)
        : setIsSuccessfullyAdded(true);
    }
  };

  if (!hasPermission) {
    return <section>Nemate ovlašćenje da pristupite ovoj stranici.</section>;
  }

  console.log(odeljenje);

  return (
    <section>
      <Typography
        variant='h5'
        align='center'
        sx={{ fontFamily: globalCtx.fontFamilyValue, mb: 4 }}
      >
        {location.state.isEditMode
          ? 'Izmena učenika'
          : 'Dodavanje novog učenika'}
      </Typography>

      <Stack direction='column' gap='20px' alignItems='center'>
        <TextField
          label='Ime učenika'
          variant='outlined'
          color='secondary'
          required
          inputRef={imeUcenikaInputRef}
          onFocus={() => updateInvalidImeUcenika((draft) => [false, null])}
          error={invalidImeUcenika[0]}
          helperText={invalidImeUcenika[0] ? invalidImeUcenika[1] : null}
          sx={{
            width: '100%',
            '& fieldset': { border: 'none' },
            '& .MuiFormLabel-root': {
              color: invalidImeUcenika[0]
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
              ? location.state.ucenik.korisnik.ime
              : null
          }
        />
        <TextField
          label='Prezime učenika'
          variant='outlined'
          color='secondary'
          required
          inputRef={prezimeUcenikaInputRef}
          onFocus={() => updateInvalidPrezimeUcenika((draft) => [false, null])}
          error={invalidPrezimeUcenika[0]}
          helperText={
            invalidPrezimeUcenika[0] ? invalidPrezimeUcenika[1] : null
          }
          sx={{
            width: '100%',
            '& fieldset': { border: 'none' },
            '& .MuiFormLabel-root': {
              color: invalidPrezimeUcenika[0]
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
              ? location.state.ucenik.korisnik.prezime
              : null
          }
        />

        <TextField
          label='JMBG učenika'
          variant='outlined'
          color='secondary'
          required
          inputRef={jmbgUcenikaInputRef}
          onFocus={() => updateInvalidJmbgUcenika((draft) => [false, null])}
          error={invalidJmbgUcenika[0]}
          helperText={invalidJmbgUcenika[0] ? invalidJmbgUcenika[1] : null}
          sx={{
            width: '100%',
            '& fieldset': { border: 'none' },
            '& .MuiFormLabel-root': {
              color: invalidJmbgUcenika[0]
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
            location.state.isEditMode ? location.state.ucenik.jmbg : null
          }
        />

        <TextField
          label='Adresa stanovanja'
          variant='outlined'
          color='secondary'
          required
          inputRef={adresaStanovanjaInputRef}
          onFocus={() =>
            updateInvalidAdresaStanovanja((draft) => [false, null])
          }
          error={invalidAdresaStanovanja[0]}
          helperText={
            invalidAdresaStanovanja[0] ? invalidAdresaStanovanja[1] : null
          }
          sx={{
            width: '100%',
            '& fieldset': { border: 'none' },
            '& .MuiFormLabel-root': {
              color: invalidAdresaStanovanja[0]
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
              ? location.state.ucenik.korisnik.adresaStanovanja
              : null
          }
        />

        <TextField
          label='Broj telefona'
          variant='outlined'
          color='secondary'
          required
          inputRef={brojTelefonaInputRef}
          onFocus={() => updateInvalidBrojTelefona((draft) => [false, null])}
          error={invalidBrojTelefona[0]}
          helperText={invalidBrojTelefona[0] ? invalidBrojTelefona[1] : null}
          sx={{
            width: '100%',
            '& fieldset': { border: 'none' },
            '& .MuiFormLabel-root': {
              color: invalidBrojTelefona[0]
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
              ? location.state.ucenik.korisnik.brojTelefona
              : null
          }
        />

        <TextField
          label='Korisničko ime'
          variant='outlined'
          color='secondary'
          required
          inputRef={korisnickoImeInputRef}
          onFocus={() => updateInvalidKorisnickoIme((draft) => [false, null])}
          error={invalidKorisnickoIme[0]}
          helperText={invalidKorisnickoIme[0] ? invalidKorisnickoIme[1] : null}
          sx={{
            width: '100%',
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
          defaultValue={
            location.state.isEditMode
              ? location.state.ucenik.korisnik.korisnickoIme
              : null
          }
        />

        <TextField
          label='Lozinka'
          variant='outlined'
          color='secondary'
          type={showPassword ? 'text' : 'password'}
          required={location.state.isEditMode ? false : true}
          inputRef={lozinkaInputRef}
          onFocus={() => updateInvalidLozinka((draft) => [false, null])}
          error={invalidLozinka[0]}
          helperText={invalidLozinka[0] ? invalidLozinka[1] : null}
          sx={{
            width: '100%',
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
          // defaultValue={
          //   location.state.isEditMode
          //     ? location.state.ucenik.korisnik.lozinka
          //     : null
          // }
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

        <Stack
          direction='row'
          sx={{
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '10px',
          }}
        >
          <Button
            variant='text'
            onClick={handleClickOpenOdeljenje}
            fullWidth
            sx={{
              color: invalidOdeljenje ? 'red' : deepPurple[300],
              fontFamily: globalCtx.fontFamilyValue,
              borderRadius: '15px',
              border: '1px solid #9575cd',
              height: '57px',
            }}
            onFocus={() => setInvalidOdeljenje(false)}
            // disabled={globalCtx.isLoggedInValue ? false : true}
          >
            Odeljenje{''}
            {odeljenje
              ? `: ${
                  odeljenjaList.find((el) => el.id === odeljenje)?.razred
                    .oznakaRazreda
                }${
                  odeljenjaList.find((el) => el.id === odeljenje)
                    ?.oznakaOdeljenja
                }`
              : ''}
          </Button>

          <Dialog
            disableEscapeKeyDown
            open={openOdeljenje}
            onClose={handleCloseOdeljenje}
          >
            <DialogTitle>Izaberite odeljenje</DialogTitle>
            <DialogContent>
              <Box component='form' sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id='odeljenje-label' color='secondary'>
                    Odeljenje
                  </InputLabel>
                  <Select
                    labelId='odeljenje-label'
                    id='dialog-odeljenje'
                    value={odeljenje}
                    onChange={handleChangeOdeljenje}
                    input={
                      <OutlinedInput color='secondary' label='Odeljenje' />
                    }
                  >
                    <MenuItem value={''}>
                      <em>Nedefinisano</em>
                    </MenuItem>

                    {odeljenjaList.map((el) => {
                      return (
                        <MenuItem key={el.id} value={el.id}>
                          {`${el.razred.oznakaRazreda}${el.oznakaOdeljenja}`}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Button
                onClick={(event) => handleCloseOdeljenje(event, 'cancel')}
                sx={{
                  color: '#000000',
                  fontFamily: globalCtx.fontFamilyValue,
                }}
              >
                Odustani
              </Button>
              <Button
                onClick={(event) => handleCloseOdeljenje(event, 'ok')}
                sx={{
                  color: '#000000',
                  fontFamily: globalCtx.fontFamilyValue,
                }}
              >
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>

        <Stack
          direction='row'
          sx={{
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '10px',
          }}
        >
          <Button
            variant='text'
            onClick={handleClickOpenRoditelj}
            fullWidth
            sx={{
              color: invalidRoditelj ? 'red' : deepPurple[300],
              fontFamily: globalCtx.fontFamilyValue,
              borderRadius: '15px',
              border: '1px solid #9575cd',
              height: '57px',
            }}
            onFocus={() => setInvalidRoditelj(false)}
            // disabled={globalCtx.isLoggedInValue ? false : true}
          >
            Roditelj{''}
            {roditelj
              ? `: ${
                  roditeljiList.find((el) => el.id === roditelj)?.korisnik?.ime
                } ${
                  roditeljiList.find((el) => el.id === roditelj)?.korisnik
                    ?.prezime
                }`
              : ''}
          </Button>

          <Dialog
            disableEscapeKeyDown
            open={openRoditelj}
            onClose={handleCloseRoditelj}
          >
            <DialogTitle>Izaberite roditelja</DialogTitle>
            <DialogContent>
              <Box component='form' sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id='roditelj-label' color='secondary'>
                    Roditelj
                  </InputLabel>
                  <Select
                    labelId='roditelj-label'
                    id='dialog-roditelj'
                    value={roditelj}
                    onChange={handleChangeRoditelj}
                    input={<OutlinedInput color='secondary' label='Roditelj' />}
                  >
                    <MenuItem value={''}>
                      <em>Nedefinisano</em>
                    </MenuItem>

                    {roditeljiList.map((el) => {
                      return (
                        <MenuItem key={el.id} value={el.id}>
                          {`${el?.korisnik?.ime} ${el?.korisnik?.prezime}`}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Button
                onClick={(event) => handleCloseRoditelj(event, 'cancel')}
                sx={{
                  color: '#000000',
                  fontFamily: globalCtx.fontFamilyValue,
                }}
              >
                Odustani
              </Button>
              <Button
                onClick={(event) => handleCloseRoditelj(event, 'ok')}
                sx={{
                  color: '#000000',
                  fontFamily: globalCtx.fontFamilyValue,
                }}
              >
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>

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
            onClick={() => nav('/ucenici')}
            sx={{
              color: deepPurple[300],
              fontFamily: globalCtx.fontFamilyValue,
              borderRadius: '15px',
            }}
            // disabled={globalCtx.isLoggedInValue ? false : true}
          >
            Odustani
          </Button>

          <Typography
            sx={{ fontFamily: globalCtx.fontFamilyValue, color: 'green' }}
          >
            {`${isSuccessfullyAdded ? 'Učenik dodat!' : ''}`}
            {`${isSuccessfullyModified ? 'Učenik izmenjen!' : ''}`}
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
            // disabled={globalCtx.isLoggedInValue ? false : true}
          >
            {location.state.isEditMode ? 'Izmeni' : 'Dodaj'}
          </Button>
        </Stack>
      </Stack>
    </section>
  );
};

export default UcenikForma;
