// import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Button } from '@mui/material';
import useSignOut from 'react-auth-kit/hooks/useSignOut';

import { postOdjava } from '../util/http';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { useContext } from 'react';
import GlobalContext from '../context/global-context';
import { useNavigate } from 'react-router-dom';
import schoolImg from '../assets/school.png';
import { deepPurple } from '@mui/material/colors';

const Header = () => {
  const globalCtx = useContext(GlobalContext);
  // const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const authHeader = useAuthHeader();
  const nav = useNavigate();

  // useEffect(() => {
  //   console.log('isauthenticated: ', isAuthenticated);
  // }, [isAuthenticated]);

  const handleOdjava = async () => {
    // try {
    // console.log('authHeader', authHeader);
    // const response =
    await postOdjava(authHeader);
    // console.log('response', response);

    //   if (response.status !== 200) {
    //     throw new Error('Došlo je do greške.');
    //   }
    // } catch (err) {
    //   throw new Error('Greška: ' + err);
    // }

    // console.log('globalCtx.isLoggedInValue: ', globalCtx.isLoggedInValue);
    signOut();
    globalCtx.setIsLoggedInFn(false);
    nav('/');
  };

  return (
    <header>
      <Box
        component='img'
        src={schoolImg}
        alt='School'
        sx={{
          width: '120px',
          '&:hover': { cursor: 'pointer' },
        }}
        onClick={() => nav('/')}
      />
      <h1>ELEKTRONSKI DNEVNIK</h1>

      <Button
        variant='outlined'
        endIcon={<LogoutIcon />}
        onClick={handleOdjava}
        sx={{
          color: deepPurple[300],
          fontFamily: 'cursive',
        }}
        disabled={globalCtx.isLoggedInValue ? false : true}
      >
        Odjava
      </Button>
    </header>
  );
};

export default Header;
