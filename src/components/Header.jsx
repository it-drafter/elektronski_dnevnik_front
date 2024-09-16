import LogoutIcon from '@mui/icons-material/Logout';
import { Button } from '@mui/material';
import useSignOut from 'react-auth-kit/hooks/useSignOut';

import { postOdjava } from '../util/http';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { useContext } from 'react';
import GlobalContext from '../context/global-context';
import { useNavigate } from 'react-router-dom';
import { deepPurple } from '@mui/material/colors';
import SchoolIcon from '@mui/icons-material/School';

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
      <Button
        variant='text'
        onClick={() => nav('/')}
        sx={{ width: '100px', borderRadius: '15px' }}
      >
        <SchoolIcon sx={{ color: '#9575cd', fontSize: '75px' }} />
      </Button>

      <h1>ELEKTRONSKI DNEVNIK</h1>

      <Button
        variant='outlined'
        endIcon={<LogoutIcon />}
        onClick={handleOdjava}
        sx={{
          color: deepPurple[300],
          fontFamily: globalCtx.fontFamilyValue,
          borderRadius: '15px',
        }}
        disabled={globalCtx.isLoggedInValue ? false : true}
      >
        Odjava
      </Button>
    </header>
  );
};

export default Header;
