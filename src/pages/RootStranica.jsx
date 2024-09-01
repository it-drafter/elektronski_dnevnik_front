/* eslint-disable */
// Iskljucen ESLint jer ne zna sta je to props.children!

import { Outlet, NavLink } from 'react-router-dom';

import '../css/cssreset.css';
import '../css/styles.css';

const RootStranica = ({ children }) => {
  return (
    <div className='root-stranica'>
      <header>ELEKTRONSKI DNEVNIK</header>
      <main>
        <nav>
          <ul>
            <li>
              <NavLink
                to={'/'}
                className={({ isActive, isPending }) =>
                  isActive ? 'active' : isPending ? 'pending' : ''
                }
              >
                Pocetna
              </NavLink>
            </li>
            <li>
              <NavLink to={'predmeti'}>Predmeti</NavLink>
            </li>
            <li>
              <NavLink to={'predmeticss'}>Predmeti CSS</NavLink>
            </li>
            <li>
              <NavLink to={'ucenici'}>Ucenici</NavLink>
            </li>
            <li>
              <NavLink to={'odjava'}>Odjava</NavLink>
            </li>
          </ul>
        </nav>
        {children ?? <Outlet />}
      </main>
      <footer>Design &amp; code: Ivan Tančik</footer>
    </div>
  );
};

export default RootStranica;
