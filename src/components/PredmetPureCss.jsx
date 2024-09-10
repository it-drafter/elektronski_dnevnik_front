const PredmetPureCss = ({ predmet }) => {
  if (!predmet) {
    return <p>Loading...</p>;
  }

  // console.log('PURE CSS PREDMET', predmet);

  return (
    <div className='predmet-purecss-container'>
      <div className='predmet-purecss-naziv-sifra'>
        <h2>{predmet.nazivPredmeta}</h2>
        <p>{predmet.sifraPredmeta}</p>
      </div>

      <p>{predmet.opisPredmeta}</p>

      <p>Prikaži</p>
    </div>
  );
};

export default PredmetPureCss;
