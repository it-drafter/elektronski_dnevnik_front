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
  const signOut = useSignOut();
  const authHeader = useAuthHeader();
  const nav = useNavigate();

  const handleOdjava = async () => {
    await postOdjava(authHeader);

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
