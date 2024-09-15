import React from 'react';

const GlobalContext = React.createContext({
  isLoggedInValue: false,
  setIsLoggedInFn: () => {},
  fontFamilyValue: '',
});

export default GlobalContext;
