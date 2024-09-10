/* eslint-disable */
// Iskljucen ESLint jer ne zna sta je to props.children!

import { Outlet, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import GlobalContext from '../context/global-context';

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
            {globalCtx.isLoggedInValue && (
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
            {/* <li>
              <NavLink to={'odjava'}>Odjava</NavLink>
            </li> */}
          </List>
        </nav>

        {children ?? <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default RootStranica;
