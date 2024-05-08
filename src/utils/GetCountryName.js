import countries from 'iso-3166-1-alpha-2';

export const getCountryName = code => {
    const country = countries.getCountry(code);
    return country ? country : 'Unknown';
  };