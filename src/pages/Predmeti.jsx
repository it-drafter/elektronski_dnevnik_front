import { useContext, useEffect, useRef, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import '../css/predmeti_pure_css.css';

import { useFetcher, useLoaderData, useNavigate } from 'react-router-dom';
import Predmet from '../components/Predmet';
import { Button, Stack, TextField, Typography } from '@mui/material';
import GlobalContext from '../context/global-context';
import { deepPurple, grey } from '@mui/material/colors';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const Predmeti = () => {
  const fetcher = useFetcher();
  const searchInputRef = useRef();
  const globalCtx = useContext(GlobalContext);
  const auth = useAuthUser();
  const nav = useNavigate();

  const [predmeti, setPredmeti] = useState(useLoaderData());
  const [q, setQ] = useState('');

  useEffect(() => {
    if (fetcher.data) {
      console.log('fetcher.data', fetcher.data);
      setPredmeti(fetcher.data);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <section>
      <Typography
        variant='h5'
        align='center'
        sx={{ fontFamily: globalCtx.fontFamilyValue, mb: 4 }}
      >
        Predmeti - MUI
      </Typography>

      <Stack
        direction='row'
        alignItems='end'
        justifyContent='center'
        spacing={2}
        mb={4}
        pl={2}
        pr={2}
      >
        <TextField
          label='Pretraga...'
          type='search'
          variant='outlined'
          color='secondary'
          value={q}
          inputRef={searchInputRef}
          onChange={(e) => {
            setQ(e.target.value);
            fetcher.load(`?q=${encodeURIComponent(e.target.value)}`);
          }}
          sx={{
            width: '70%',
            '& fieldset': { border: 'none' },
            '& .MuiFormLabel-root': {
              color: deepPurple[200] + '!important',
              fontFamily: globalCtx.fontFamilyValue + '!important',
            },
            input: {
              color: grey['A100'],
              // backgroundColor: deepPurple[500],
              borderRadius: '15px',
              height: '22px',
              marginTop: '10px',
              border: '1px solid #9575cd',
            },
          }}
        />

        {auth?.role === 'ROLA_ADMINISTRATOR' && (
          <Button
            variant='outlined'
            // onClick={(e) => nav('/add_book')}
            sx={{
              fontFamily: globalCtx.fontFamilyValue,
              // backgroundColor: deepPurple[500],
              color: deepPurple[300],
              height: '58px',
              borderRadius: '15px',
            }}
            onClick={(e) =>
              nav('/predmet-forma', { state: { isEditMode: false } })
            }
          >
            <AddCircleOutlineIcon sx={{ mr: 1 }} /> Dodaj predmet
          </Button>
        )}
      </Stack>

      <div className='predmeti-purecss-container'>
        {predmeti.map((el) => (
          <Predmet key={el.id} predmet={el} fetcherFun={fetcher} />
        ))}
      </div>
    </section>
  );
};

export default Predmeti;
