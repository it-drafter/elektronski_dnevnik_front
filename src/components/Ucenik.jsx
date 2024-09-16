import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import { useContext } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GlobalContext from '../context/global-context';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../util/browserStorage';
import { deleteUcenici } from '../util/http';

const Ucenik = ({ ucenik, fetcherFun }) => {
  const globalCtx = useContext(GlobalContext);
  const auth = useAuthUser();
  const nav = useNavigate();

  return (
    <Card
      variant='outlined'
      sx={{
        width: '300px',
        height: '400px',
        backgroundColor: '#0f1214',
        color: '#9575cd',
        border: '1px solid #9575cd',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '15px',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant='h6'
          component='div'
          sx={{ fontFamily: globalCtx.fontFamilyValue, textAlign: 'center' }}
        >
          {`${ucenik.korisnik.ime} ${ucenik.korisnik.prezime}`}
        </Typography>
        <Typography
          variant='body2'
          sx={{
            color: '#ad99ce',
            mb: 1.5,
            fontFamily: globalCtx.fontFamilyValue,
          }}
        >
          JMBG: {ucenik.jmbg}
        </Typography>
        <Typography
          variant='body2'
          sx={{
            color: '#ad99ce',
            mb: 1.5,
            fontFamily: globalCtx.fontFamilyValue,
          }}
        >
          Razred/Odeljenje:{' '}
          {ucenik?.odeljenje?.oznakaOdeljenja
            ? `${ucenik?.odeljenje?.razred?.oznakaRazreda}${ucenik?.odeljenje?.oznakaOdeljenja}`
            : 'Nema podatka'}
        </Typography>
        <Typography
          sx={{ fontFamily: globalCtx.fontFamilyValue }}
          variant='caption'
        >
          Adresa: {ucenik.korisnik.adresaStanovanja} <br />
          Telefon: {ucenik.korisnik.brojTelefona} <br />
          Korisničko ime: {ucenik.korisnik.korisnickoIme} <br />
          <br />
          Roditelj:{' '}
          {ucenik?.roditelj?.korisnik?.prezime
            ? `${ucenik?.roditelj?.korisnik?.ime} ${ucenik?.roditelj?.korisnik?.prezime}`
            : 'Nema podatka'}{' '}
          <br />
          Email roditelja:{' '}
          {ucenik?.roditelj?.emailAdresa
            ? ucenik?.roditelj?.emailAdresa
            : 'Nema podatka'}{' '}
          <br />
          Telefon roditelja:{' '}
          {ucenik?.roditelj?.korisnik?.brojTelefona
            ? ucenik?.roditelj?.korisnik?.brojTelefona
            : 'Nema podatka'}
        </Typography>
      </CardContent>
      {auth?.role === 'ROLA_ADMINISTRATOR' && (
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 20px 20px',
          }}
        >
          <Button variant='text' sx={{ borderRadius: '15px' }}>
            <EditIcon
              sx={{ color: '#9575cd' }}
              onClick={
                (e) =>
                  nav('/ucenik-forma', {
                    state: { isEditMode: true, ucenik: ucenik },
                  })
                // console.log('click edit ucenik')
              }
            />
          </Button>

          <Button variant='text' sx={{ borderRadius: '15px' }}>
            <DeleteIcon
              sx={{ color: '#9575cd' }}
              onClick={async (e) => {
                await deleteUcenici('Bearer ' + getToken(), ucenik.id);
                fetcherFun.load();
                // console.log('click delete ucenik');
              }}
            />
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default Ucenik;
