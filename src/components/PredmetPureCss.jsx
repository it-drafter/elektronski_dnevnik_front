const PredmetPureCss = ({ predmet }) => {
  return (
    <div className='predmet-purecss-container'>
      <div className='predmet-purecss-naziv-sifra'>
        <h2>{predmet.nazivPredmeta}</h2>
        <p>{predmet.sifraPredmeta}</p>
      </div>

      <p className='predmet-purecss-opis-predmeta'>{predmet.opisPredmeta}</p>

      <p>Nedeljno časova: {predmet.nedeljniFondCasova}</p>
    </div>
  );
};

export default PredmetPureCss;
