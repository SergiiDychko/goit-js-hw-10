import '../css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;

const searchBoxRef = document.querySelector('input#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

searchBoxRef.addEventListener(
  'input',
  debounce(() => {
    if (searchBoxRef.value.trim() !== '') {
      fetchCountries(searchBoxRef.value.trim())
        .then(countries => renderCountryList(countries))
        .catch(error => {
          console.log(error);
          Notify.failure('Oops, there is no country with that name');
          countryListRef.innerHTML = '';
          countryInfoRef.innerHTML = '';
        });
    }
  }, DEBOUNCE_DELAY)
);

function renderCountryList(countries) {
if (countries.length > 10) {
    countryListRef.innerHTML = '';
    countryInfoRef.innerHTML = '';
    return Notify.info(
      'Too many matches found. Please enter a more specific name'
    );
}
  countryInfoRef.innerHTML = '';
  const markup = countries
    .map(country => {
      return `
            <li class="country-item">
              <img class="country-flag" src="${country.flags.svg}" alt="${country.name}" width="24px" height="16px">
              <span class="country-name">${country.name}</span>
            </li>
        `;
    })
    .join('');
  countryListRef.innerHTML = markup;
  if (countries.length === 1) {
    document.querySelector('.country-name').classList.add('single-country');
    countryInfoRef.innerHTML = `
      <p><span class="info-title">Capital: </span>${countries[0].capital}</p>
      <p><span class="info-title">Population: </span>${
        countries[0].population
      }</p>
      <p><span class="info-title">Languages: </span>${countries[0].languages.map(
        language => language.name).join(', ')}</p>
    `;
  }
}
