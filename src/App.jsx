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
import { getPredmeti } from './util/http';
import { getToken } from './util/browserStorage';

const authStore = createStore({
  authName: '_auth',
  authType: 'localstorage',
  // cookieDomain: window.location.hostname,
  // cookieSecure: window.location.protocol === 'http:',
});

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
      },
      {
        path: 'predmetipurecss',
        element: (
          <RequireAuth fallbackPath={'/infoprijava'}>
            <PredmetiPureCss />
          </RequireAuth>
        ),
        loader: async ({ request }) => {
          let url = new URL(request.url);
          let q = url.searchParams.get('q');

          if (getToken()) {
            const response = await getPredmeti('Bearer ' + getToken());

            if (!q || q === '') {
              return response.data;
            } else {
              console.log('pretrazi predmete', q);

              return response.data.filter((v) => {
                let qq = q.toLowerCase();

                let r =
                  v.nazivPredmeta.toLowerCase().includes(qq) ||
                  v.opisPredmeta.toLowerCase().includes(qq);

                console.log(r);

                return r;
              });
            }
          }

          return null;
        },
      },
      {
        path: 'ucenici',
        element: (
          <RequireAuth fallbackPath={'/infoprijava'}>
            <Ucenici />
          </RequireAuth>
        ),
      },
    ],
  },
]);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(getToken() !== null);

  return (
    <AuthProvider store={authStore}>
      <GlobalContext.Provider
        value={{
          isLoggedInValue: isLoggedIn,
          setIsLoggedInFn: setIsLoggedIn,
        }}
      >
        <RouterProvider router={router} />
      </GlobalContext.Provider>
    </AuthProvider>
  );
};

export default App;
