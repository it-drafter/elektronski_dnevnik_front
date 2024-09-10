export const getToken = () => {
  const token = window.localStorage.getItem('_auth');

  return token;
};
