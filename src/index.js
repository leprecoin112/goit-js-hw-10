import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './js/countries-api-service';

const DEBOUNCE_DELAY = 300;
const ERROR_TEXT = 'Oops, there is no country with that name';
const INFO_TEXT = 'Too many matches found. Please enter a more specific name.';

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const text = e.target.value.trim();
  clearCountry();
  if (text === '') {
    return;
  }
  fetchCountries(text)
    .then(countries => {
      if (countries.length > 10) {
        info();
        return;
      } else if (countries.length > 1 && countries.length < 10) {
        console.log('if ' + countries.length);
        refs.countryList.innerHTML = countries
          .map(countriesListMarkup)
          .join('');
      } else {
        console.log(countries.length);
        refs.countryInfo.innerHTML = countryInfoMarkup(countries[0]);
      }
    })
    .catch(error);
}

function countriesListMarkup({ name, flags }) {
  return `<li class="country-list__item"><img width="40" src="${flags.svg}" class="country-list__icon" alt="${name.common}"><span class="country-list__text">${name.common}</span></li>`;
}

function clearCountry() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function countryInfoMarkup({ name, flags, capital, population, languages }) {
  const langs = Object.values(languages).join(', ');
  return `<div class="country-info__wrapper"><img width="40" src="${flags.svg}" class="country-info__icon" alt="${name.common}">
	<span class="country-info__name">${name.common}</span></div>
	<span class="country-info__text"><span class="country-info__pre-text">Capital: </span>${capital}</span>
	<span class="country-info__text"><span class="country-info__pre-text">Population: </span>${population}</span>
	<span class="country-info__text"><span class="country-info__pre-text">Languages: </span>${langs}</span>`;
}

function info() {
  Notiflix.Notify.info(INFO_TEXT);
}

function error() {
  Notiflix.Notify.failure(ERROR_TEXT);
}
