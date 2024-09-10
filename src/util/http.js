import axios from 'axios';

export const getRukovanje = async (token) => {
  const response = await axios.get('http://localhost:8080/dnevnik/handshake', {
    headers: { Authorization: token },
  });

  return response;
};

export const postPrijava = async (username, password) => {
  const response = await axios.post(
    `http://localhost:8080/dnevnik/login?user=${username}&password=${password}`
  );

  return response;
};

export const postOdjava = async (token) => {
  const response = await axios.post(
    'http://localhost:8080/dnevnik/logout',
    null,
    {
      headers: { Authorization: token },
    }
  );

  return response;
};

export const getPredmeti = async (token) => {
  const response = await axios.get('http://localhost:8080/dnevnik/predmeti', {
    headers: { Authorization: token },
  });

  return response;
};
