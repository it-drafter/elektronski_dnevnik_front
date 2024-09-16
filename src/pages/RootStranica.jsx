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
import { deepPurple, grey } from '@mui/material/colors';
import { getRukovanjeOpen } from '../util/http';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const navStyle = {
  width: '100px',
  borderRadius: '15px',
  border: `1px solid ${deepPurple[300]}`,
  color: deepPurple[100],
  '&.active': {
    backgroundColor: deepPurple[600],
  },
  '&:hover': {
    backgroundColor: grey[800],
  },
};

const RootStranica = ({ children }) => {
  const globalCtx = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuthUser();

  useEffect(() => {
    const doTheHandshake = async () => {
      try {
        await getRukovanjeOpen();
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err);
      }
    };

    doTheHandshake();
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
                  primary={
                    <Typography sx={{ fontFamily: globalCtx.fontFamilyValue }}>
                      Početna
                    </Typography>
                  }
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
                      <Typography
                        sx={{ fontFamily: globalCtx.fontFamilyValue }}
                      >
                        Predmeti
                      </Typography>
                    }
                    secondary={
                      <Typography
                        sx={{
                          fontFamily: globalCtx.fontFamilyValue,
                          fontSize: '0.8rem',
                        }}
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
                      <Typography
                        sx={{ fontFamily: globalCtx.fontFamilyValue }}
                      >
                        Predmeti
                      </Typography>
                    }
                    secondary={
                      <Typography
                        sx={{
                          fontFamily: globalCtx.fontFamilyValue,
                          fontSize: '0.8rem',
                        }}
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
                        <Typography
                          sx={{ fontFamily: globalCtx.fontFamilyValue }}
                        >
                          Učenici
                        </Typography>
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
