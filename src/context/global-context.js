import React from 'react';

const GlobalContext = React.createContext({
  isLoggedInValue: false,
  setIsLoggedInFn: () => {},
});

export default GlobalContext;
