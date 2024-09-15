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
import { deletePredmeti } from '../util/http';

const Predmet = ({ predmet, fetcherFun }) => {
  const globalCtx = useContext(GlobalContext);
  const auth = useAuthUser();
  const nav = useNavigate();

  return (
    <Card
      variant='outlined'
      sx={{
        width: '300px',
        height: '200px',
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
          sx={{ fontFamily: globalCtx.fontFamilyValue }}
        >
          {predmet.nazivPredmeta}
        </Typography>
        <Typography
          variant='body2'
          sx={{
            color: '#ad99ce',
            mb: 1.5,
            fontFamily: globalCtx.fontFamilyValue,
          }}
        >
          {predmet.sifraPredmeta}
        </Typography>
        <Typography
          variant='body2'
          sx={{
            color: '#ad99ce',
            mb: 1.5,
            fontFamily: globalCtx.fontFamilyValue,
          }}
        >
          Nedeljno časova: {predmet.nedeljniFondCasova}
        </Typography>
        <Typography
          sx={{ fontFamily: globalCtx.fontFamilyValue }}
          variant='caption'
        >
          {predmet.opisPredmeta}
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
              onClick={(e) =>
                nav('/predmet-forma', {
                  state: { isEditMode: true, predmet: predmet },
                })
              }
            />
          </Button>

          <Button variant='text' sx={{ borderRadius: '15px' }}>
            <DeleteIcon
              sx={{ color: '#9575cd' }}
              onClick={async (e) => {
                await deletePredmeti('Bearer ' + getToken(), predmet.id);
                fetcherFun.load();
              }}
            />
          </Button>
        </CardActions>
      )}
    </Card>

    // <div className='predmet-purecss-container'>
    //   <div className='predmet-purecss-naziv-sifra'>
    //     <h2>{predmet.nazivPredmeta}</h2>
    //     <p>{predmet.sifraPredmeta}</p>
    //   </div>

    //   <p>{predmet.opisPredmeta}</p>

    //   <p>{predmet.nedeljniFondCasova}</p>
    // </div>
  );
};

export default Predmet;
