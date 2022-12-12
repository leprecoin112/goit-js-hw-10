const BASE_URL = 'https://restcountries.com/v3.1/';
export default function fetchCountries(name) {
  return fetch(
    `${BASE_URL}name/${name}?fullText=false&fields=capital,population,name,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
