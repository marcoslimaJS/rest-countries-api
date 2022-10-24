const countrysUrl = `https://restcountries.com/v3.1/all`;
const getCountries = async () => {
  const country = await fetch(countrysUrl)
  return await country.json()
}

const ulCountries = document.querySelector('[data-country="list"]');
const countryModal = document.querySelector('.country-modal');
const ulBorderCountries = document.querySelector('.border-countries-list');
const filterList = document.querySelector('.filter-list');


const workingCountries = async () => {
  const allCountriesData = await getCountries();

  const countries = allCountriesData.reduce((accum, { name:{ common, nativeName }, flags:{ png, svg }, population, region, subregion, capital, tld, currencies, languages }) => {

    const capitalTrated = capital ? capital[0] : "Doesn't have";
    const tldTrated = tld ? tld[0] : "Doesn't have";
    const subregionTrated = subregion ?? "Doesn't have";

    let nativeNameTrated = "Doesn't have";
    let currenciesTrated = "Doesn't have";
    let idiom = "";
  
    for(let x in nativeName) {
      nativeNameTrated = nativeName[x].common;
      break;
    };
    for(let x in currencies) {
      currenciesTrated = currencies[x].name;
      break;
    };
    for(let x in languages) {
      idiom += `${languages[x]}, `;
    };
    
    const languageTreated = idiom ? idiom.substring(0, idiom.length - 2) : "Doesn't have";

    const country = {
      png,
      svg,
      name: common,
      nativeName: nativeNameTrated,
      population,
      region,
      subregion: subregionTrated,
      capital: capitalTrated,
      tld: tldTrated,
      currencies: currenciesTrated,
      languages: languageTreated
    };
    accum.push(country);
    return accum
  }, []);

  function addCountries(countries) {
    const listCountries = countries.reduce((accum, {png, name, population, region, capital}) => {
      accum += `
      <li class="country-item">
        <a href="">
          <div class="country-img">
          <img src="${png}" alt="${name}">
          </div>
          <div class="country-info">
            <h3 class="country-name font-m-b2">${name}</h3>
            <ul class="country-data font-p-b">
              <li>Population: <span>${population.toLocaleString()}</span></li>
              <li>Region: <span>${region}</span></li>
              <li>Capital: <span>${capital}</span></li>
            </ul>
          </div>
        </a>
      </li>
      `
      return accum
    }, '')
    ulCountries.innerHTML = listCountries
  
    const listOfCountries = document.querySelectorAll('.country-item');
    createModal(listOfCountries);
  }
  addCountries(countries);

  function createModal(countries) {
    countries.forEach((country) => {
      country.addEventListener('click', openModal)
    })
  };

  function openModal(e) {
    e.preventDefault();
    const modal = document.querySelector('[data-modal]');
    modal.dataset.modal = 'active';
    ulCountries.style.display = "none";
    filterList.style.display = 'none';
    const dataCountry = getClickedCountry(e.currentTarget);
    setDataInModal(dataCountry);
  };
  
  function getClickedCountry(country) {
    const countryName = country.querySelector('.country-name').innerText;
    const clickedCountry = countries.find(({name}) => {
      return countryName === name;
    })
    return clickedCountry
  };

  function setDataInModal({svg, name, nativeName, population, region, subregion, capital, tld, currencies, languages}) {

    const borderCountries = getBorderContruies(region);

    const modalSvg = document.querySelector('.modal-img');
    const modalName = document.querySelector('.modal-name');
    const modalNativeName = document.querySelector('.modal-native-name');
    const modalPopulation = document.querySelector('.modal-population');
    const modalRegion = document.querySelector('.modal-region');
    const modalSubregion = document.querySelector('.modal-subregion');
    const modalCapital = document.querySelector('.modal-capital');
    const modalTopLevelDomain = document.querySelector('.modal-tld');
    const modalCurrency = document.querySelector('.modal-currencies');
    const modalLanguages = document.querySelector('.modal-languages');

    modalSvg.src = svg;
    modalSvg.alt = name;
    modalName.innerText = name;
    modalNativeName.innerText = nativeName;
    modalPopulation.innerText = population.toLocaleString();
    modalRegion.innerText = region;
    modalSubregion.innerText = subregion;
    modalCapital.innerText = capital;
    modalTopLevelDomain.innerText = tld;
    modalCurrency.innerText = currencies;
    modalLanguages.innerText = languages;

    const listBorderCountries =  borderCountries.reduce((accum, country) => {
      accum += `
      <button class="btnBorderCountry font-p-b">${country}</button>
      `
      return accum
    }, '');
    
    ulBorderCountries.innerHTML = listBorderCountries;

    //--------------------------------------------------------------

    const modalContent = document.querySelector('.country-modal-main');

    const btnBorderCountry = document.querySelectorAll('.btnBorderCountry ');

    btnBorderCountry.forEach((btn) => {
      btn.addEventListener('click', getBtnBorderCountry)
    });
  
    function getBtnBorderCountry() {
      const btnClicked = countries.find(({name}) => {
        return this.innerText === name;
      });

      const currentCountry = document.querySelector('.modal-name');
      if(this.innerText !== currentCountry.innerText) {
        modalContent.classList.add('active');
        setTimeout(() => {
          modalContent.classList.remove('active');
        }, 300);
      };

      setDataInModal(btnClicked);
    };
  };

  function getBorderContruies(currentRegion) {
    const filteredByRegion = countries.filter(({region}) => {
      return region === currentRegion;
    });
    
    const allPopulation = filteredByRegion.map(({population}) => population);
    allPopulation.sort((a,b) => b-a);
    const top3Population = allPopulation.slice(0,3);
    
    const top3CountriesPopulation = filteredByRegion.filter(({population}) => {
      return population === top3Population[0] || population === top3Population[1] || population === top3Population[2]
    })

    const countriesNames = top3CountriesPopulation.map(({ name }) => name)
    return countriesNames
  };

  const btnModalBack = document.querySelector('.country-modal-btn-back');

  btnModalBack.addEventListener('click', closeModal);

  function closeModal() {
    const modal = document.querySelector('[data-modal]');
    modal.dataset.modal = 'disabled';
    ulCountries.style.display = "flex";
    filterList.style.display = 'block';
  };

  //------------------------------------------------------------------

  const filterCountry = document.querySelector('.filter-country');
  filterCountry.addEventListener('click', openFilterModal);

  function openFilterModal(e) {
    e.preventDefault();
    filterCountry.classList.toggle('active');
  }

  //------------------------------------------------------

  const filterListItem = document.querySelectorAll('.filter-list li');

  filterListItem.forEach((region) => {
    region.addEventListener('click', filterRegion);
  });

  function filterRegion(e) {
    e.preventDefault();
    const filteredCountries = countries.filter(({region}) => {
      return e.currentTarget.id === region
    })
    addCountries(filteredCountries);
  }

  //---------------------------------------------

  const inputSearch = document.querySelector('#search');

  inputSearch.addEventListener('keydown', filterSearch);

  function filterSearch() {
    setTimeout(() => {
      const filteredSearch = countries.filter(({ name }) => {
        const countryName = name.toLowerCase();
        const searchName  = inputSearch.value.toLowerCase();
        return countryName.startsWith(searchName)
      });
      addCountries(filteredSearch);
    }, 100);
  };
};

workingCountries();