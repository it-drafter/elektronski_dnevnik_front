import axios from 'axios';

export const getRukovanjeOpen = async () => {
  const response = await axios.get(
    'http://localhost:8080/dnevnik/handshake/open'
  );

  return response;
};

export const getRukovanjeSecured = async (token) => {
  const response = await axios.get(
    'http://localhost:8080/dnevnik/handshake/secured',
    {
      headers: { Authorization: token },
    }
  );

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

export const postPredmeti = async (token, payload) => {
  console.log('payload', payload);
  const response = await axios.post(
    'http://localhost:8080/dnevnik/predmeti',
    payload,
    {
      headers: { Authorization: token },
    }
  );

  return response;
};

export const putPredmeti = async (token, payload, idPredmeta) => {
  console.log('payload', payload);
  const response = await axios.put(
    `http://localhost:8080/dnevnik/predmeti/${idPredmeta}`,
    payload,
    {
      headers: { Authorization: token },
    }
  );

  return response;
};

export const deletePredmeti = async (token, idPredmeta) => {
  const response = await axios.delete(
    `http://localhost:8080/dnevnik/predmeti/${idPredmeta}`,
    {
      headers: { Authorization: token },
    }
  );

  return response;
};

export const getUcenici = async (token) => {
  const response = await axios.get('http://localhost:8080/dnevnik/ucenici', {
    headers: { Authorization: token },
  });

  return response;
};
