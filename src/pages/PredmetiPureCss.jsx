import { useEffect, useRef, useState } from 'react';
import { useFetcher, useLoaderData } from 'react-router-dom';
import PredmetPureCss from '../components/PredmetPureCss';

const PredmetiPureCss = () => {
  const fetcher = useFetcher();
  const searchInput = useRef(null);

  const [predmeti, setPredmeti] = useState(useLoaderData());
  const [q, setQ] = useState('');

  useEffect(() => {
    if (fetcher.data) {
      setPredmeti(fetcher.data);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (searchInput.current) {
      searchInput.current.focus();
    }
  }, []);

  return (
    <section className='section-pure-css'>
      <h2>Predmeti - Pure CSS</h2>

      <div className='search-container'>
        <input
          type='search'
          placeholder='Search...'
          className='search-box'
          value={q}
          ref={searchInput}
          onChange={(e) => {
            setQ(e.target.value);
            fetcher.load(`?q=${encodeURIComponent(e.target.value)}`);
          }}
        />
      </div>

      <div className='predmeti-purecss-container'>
        {predmeti.map((el) => (
          <PredmetPureCss key={el.id} predmet={el} />
        ))}
      </div>
    </section>
  );
};

export default PredmetiPureCss;
