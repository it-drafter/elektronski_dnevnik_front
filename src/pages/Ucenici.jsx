import { useContext, useEffect, useRef, useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useFetcher, useLoaderData, useNavigate } from 'react-router-dom';
import GlobalContext from '../context/global-context';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { deepPurple, grey } from '@mui/material/colors';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Ucenik from '../components/Ucenik';

const Ucenici = () => {
  const auth = useAuthUser();
  const [hasPermission, setHasPermission] = useState(false);
  const fetcher = useFetcher();
  const searchInputRef = useRef();
  const globalCtx = useContext(GlobalContext);
  const nav = useNavigate();

  const [ucenici, setUcenici] = useState(useLoaderData());
  const [q, setQ] = useState('');

  useEffect(() => {
    if (
      auth?.role === 'ROLA_ADMINISTRATOR' ||
      auth?.role === 'ROLA_NASTAVNIK'
    ) {
      setHasPermission(true);
    }
  }, []);

  useEffect(() => {
    if (fetcher.data) {
      console.log('fetcher.data', fetcher.data);
      setUcenici(fetcher.data);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

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
        Učenici
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
            onClick={
              (e) => nav('/ucenik-forma', { state: { isEditMode: false } })
              // console.log('click novi ucenik')
            }
          >
            <AddCircleOutlineIcon sx={{ mr: 1 }} /> Dodaj učenika
          </Button>
        )}
      </Stack>

      <div className='predmeti-purecss-container'>
        {ucenici.map((el) => (
          <Ucenik key={el.id} ucenik={el} fetcherFun={fetcher} />
        ))}
      </div>
    </section>
  );
};

export default Ucenici;
