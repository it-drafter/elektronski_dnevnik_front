import React from 'react';

const GlobalContext = React.createContext({
  isLoggedInValue: false,
  setIsLoggedInFn: () => {},
  rolaKorisnikaValue: '',
  setRolaKorisnikaFn: () => {},
});

export default GlobalContext;
