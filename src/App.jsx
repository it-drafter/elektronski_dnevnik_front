import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import createStore from 'react-auth-kit/createStore';
import AuthProvider from 'react-auth-kit';
import RequireAuth from '@auth-kit/react-router/RequireAuth';

import GlobalContext from './context/global-context';
import ErrorStranica from './pages/ErrorStranica';
import RootStranica from './pages/RootStranica';
import Pocetna from './pages/Pocetna';
import Predmeti from './pages/Predmeti';
import PredmetiPureCss from './pages/PredmetiPureCss';
import Ucenici from './pages/Ucenici';
import InfoPrijava from './pages/InfoPrijava';
import { getPredmeti, getUcenici } from './util/http';
import { getToken } from './util/browserStorage';
import PredmetForma from './pages/PredmetForma';
import UcenikForma from './pages/UcenikForma';

const authStore = createStore({
  authName: '_auth',
  authType: 'localstorage',
  // cookieDomain: window.location.hostname,
  // cookieSecure: window.location.protocol === 'http:',
});

const loadData = async (request, entity) => {
  {
    let url = new URL(request.url);
    let q = url.searchParams.get('q');

    if (getToken()) {
      let response;

      if (entity === 'predmeti') {
        response = await getPredmeti('Bearer ' + getToken());
      }

      if (entity === 'ucenici') {
        response = await getUcenici('Bearer ' + getToken());
      }

      if (!q || q === '') {
        return response.data;
      } else {
        return response.data.filter((v) => {
          let qq = q.toLowerCase();
          let r;

          if (entity === 'predmeti') {
            r =
              v.nazivPredmeta.toLowerCase().includes(qq) ||
              v.opisPredmeta.toLowerCase().includes(qq);
          }

          if (entity === 'ucenici') {
            r =
              v.jmbg.toLowerCase().includes(qq) ||
              v.korisnik.ime.toLowerCase().includes(qq) ||
              v.korisnik.prezime.toLowerCase().includes(qq);
          }

          return r;
        });
      }
    }

    return null;
  }
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootStranica />,
    errorElement: (
      <RootStranica>
        <ErrorStranica />
      </RootStranica>
    ),
    children: [
      {
        index: true,
        element: <Pocetna />,
      },
      {
        path: 'infoprijava',
        element: <InfoPrijava />,
      },
      {
        path: 'predmeti',
        element: (
          <RequireAuth fallbackPath={'/infoprijava'}>
            <Predmeti />
          </RequireAuth>
        ),
        loader: ({ request }) => {
          return loadData(request, 'predmeti');
        },
      },
      {
        path: 'predmetipurecss',
        element: (
          <RequireAuth fallbackPath={'/infoprijava'}>
            <PredmetiPureCss />
          </RequireAuth>
        ),
        loader: ({ request }) => {
          return loadData(request, 'predmeti');
        },
      },
      {
        path: 'ucenici',
        element: (
          <RequireAuth fallbackPath={'/infoprijava'}>
            <Ucenici />
          </RequireAuth>
        ),
        loader: ({ request }) => {
          return loadData(request, 'ucenici');
        },
      },
      {
        path: 'predmet-forma',
        element: (
          <RequireAuth fallbackPath={'/infoprijava'}>
            <PredmetForma />
          </RequireAuth>
        ),
      },
      {
        path: 'ucenik-forma',
        element: (
          <RequireAuth fallbackPath={'/infoprijava'}>
            <UcenikForma />
          </RequireAuth>
        ),
      },
    ],
  },
]);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(getToken() !== null);

  const fontFamily = 'Verdana, Geneva, Tahoma, sans-serif';

  return (
    <AuthProvider store={authStore}>
      <GlobalContext.Provider
        value={{
          isLoggedInValue: isLoggedIn,
          setIsLoggedInFn: setIsLoggedIn,
          fontFamilyValue: fontFamily,
        }}
      >
        <RouterProvider router={router} />
      </GlobalContext.Provider>
    </AuthProvider>
  );
};

export default App;
