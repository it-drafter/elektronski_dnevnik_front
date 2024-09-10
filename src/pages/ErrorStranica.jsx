import { useRouteError } from 'react-router-dom';

const ErrorStranica = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <section>
      <h1>Ooo ne!</h1>
      <p>Došlo je do greške.</p>
      <p>{error.statusText || error.message}</p>
    </section>
  );
};

export default ErrorStranica;
