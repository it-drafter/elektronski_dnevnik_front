// Iskljucen ESLint jer ne zna sta je to props.children!

import { Outlet, NavLink } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import GlobalContext from '../context/global-context';
import { CircularProgress, Box } from '@mui/material';

import '../css/cssreset.css';
import '../css/styles.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { deepPurple, orange, grey } from '@mui/material/colors';
import { postPrijava } from '../util/http';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const navStyle = {
  borderRadius: '50%',
  backgroundColor: deepPurple[500],
  color: grey['A100'],
  '&.active': {
    backgroundColor: orange[900],
  },
  '&:hover': {
    backgroundColor: grey[800],
  },
};

const fontFamily = {
  fontFamily: 'cursive',
};

const RootStranica = ({ children }) => {
  const globalCtx = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuthUser();

  useEffect(() => {
    if (globalCtx.isLoggedInValue) {
      const doTheHandshake = async () => {
        try {
          await postPrijava('fakeuser', 'fakepassword');
        } catch (err) {
          if (err?.status === 401) {
            setIsLoading(false);
          } else {
            setError(err);
          }
        }
      };

      doTheHandshake();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (error) {
    return (
      <div className='whole-page-flex-container'>
        Server je trenutno nedostupan. Molimo pokušajte kasnije.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='whole-page-flex-container'>
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  return (
    <div className='root-stranica'>
      <Header />
      <main>
        <nav>
          <List>
            <ListItem>
              <ListItemButton component={NavLink} to={'/'} sx={navStyle}>
                <ListItemText
                  primary={<Typography style={fontFamily}>Početna</Typography>}
                />
              </ListItemButton>
            </ListItem>

            {globalCtx.isLoggedInValue && (
              <ListItem>
                <ListItemButton
                  component={NavLink}
                  to={'predmeti'}
                  sx={navStyle}
                >
                  <ListItemText
                    primary={
                      <Typography style={fontFamily}>Predmeti</Typography>
                    }
                    secondary={
                      <Typography
                        style={{ fontFamily: 'cursive', fontSize: '0.8rem' }}
                      >
                        MUI
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            )}
            {globalCtx.isLoggedInValue && (
              <ListItem>
                <ListItemButton
                  component={NavLink}
                  to={'predmetipurecss'}
                  sx={navStyle}
                >
                  <ListItemText
                    primary={
                      <Typography style={fontFamily}>Predmeti</Typography>
                    }
                    secondary={
                      <Typography
                        style={{ fontFamily: 'cursive', fontSize: '0.8rem' }}
                      >
                        Pure CSS
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            )}
            {globalCtx.isLoggedInValue &&
              (auth?.role === 'ROLA_ADMINISTRATOR' ||
                auth?.role === 'ROLA_NASTAVNIK') && (
                <ListItem>
                  <ListItemButton
                    component={NavLink}
                    to={'ucenici'}
                    sx={navStyle}
                  >
                    <ListItemText
                      primary={
                        <Typography style={fontFamily}>Učenici</Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              )}
          </List>
        </nav>

        {children ?? <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default RootStranica;
