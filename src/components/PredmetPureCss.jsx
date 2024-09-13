const PredmetPureCss = ({ predmet }) => {
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
