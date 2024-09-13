import { useEffect, useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const Ucenici = () => {
  const auth = useAuthUser();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (
      auth?.role === 'ROLA_ADMINISTRATOR' ||
      auth?.role === 'ROLA_NASTAVNIK'
    ) {
      setHasPermission(true);
    }
  }, []);

  if (!hasPermission) {
    return <section>Nemate ovlašćenje da pristupite ovoj stranici.</section>;
  }

  return <section>Ucenici</section>;
};

export default Ucenici;
