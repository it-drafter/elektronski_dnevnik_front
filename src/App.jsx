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
import PredmetiCss from './pages/PredmetiCss';
import Ucenici from './pages/Ucenici';
import Odjava from './pages/Odjava';
import InfoPrijava from './pages/InfoPrijava';

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
        path: 'predmeticss',
        element: (
          <RequireAuth fallbackPath={'/infoprijava'}>
            <PredmetiCss />
          </RequireAuth>
        ),
      },
      {
        path: 'ucenici',
        element: (
          <RequireAuth fallbackPath={'/infoprijava'}>
            <Ucenici />
          </RequireAuth>
        ),
      },
      {
        path: 'odjava',
        element: (
          <RequireAuth fallbackPath={'/infoprijava'}>
            <Odjava />
          </RequireAuth>
        ),
      },
    ],
  },
]);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
}

export default App;
