import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;

const searchBoxRef = document.querySelector('input#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

searchBoxRef.addEventListener(
  'input',
  debounce(() => {
    fetchCountries(searchBoxRef.value.trim())
      .then(countries => renderCountryList(countries))
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        countryListRef.innerHTML = '';
        countryInfoRef.innerHTML = '';
      });
  }, DEBOUNCE_DELAY)
);

function renderCountryList(countries) {
  console.log(countries.length);
  if (countries.length > 10) {
    countryListRef.innerHTML = '';
    countryInfoRef.innerHTML = '';
    return Notify.info(
      'Too many matches found. Please enter a more specific name'
    );
  } else if ((countries.length <= 10) & (countries.length >= 2)) {
    const markup = countries
      .map(country => {
        return `
            <li>
              <p><b>Name</b>: ${country.name}</p>
              <p><b>capital</b>: ${country.capital}</p>
              <p><b>population</b>: ${country.population}</p>
              </li>
        `;
      })
      .join('');
    countryListRef.innerHTML = markup;
  } else if (countries.length === 1) {
    const markup = countries
      .map(country => {
        return `
            <li>
              <p><b>flag</b>: ${country.flags.svg}</p>
              <p><b>Name</b>: ${country.name}</p>
              </li>
        `;
      })
      .join('');
    countryListRef.innerHTML = '';
    countryInfoRef.innerHTML = markup;
  } else {
    return Notify.info('Start typing the name of the country, please');
  }
}
