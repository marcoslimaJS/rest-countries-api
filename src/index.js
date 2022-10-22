const countrysUrl = `https://restcountries.com/v3.1/all`;
const getCountries = async () => {
  const country = await fetch(countrysUrl)
  return await country.json()
}

const ulCountries = document.querySelector('[data-country="list"]');
const countryModal = document.querySelector('.country-modal');
const ulBorderCountries = document.querySelector('.border-countries-list');

const workingCountries = async () => {
  const countries = await getCountries()

  function addCountries(countries) {
    const listCountries = countries.reduce((accum, {name:{common}, flags:{png}, population, region, capital}) => {
      const central = capital ? capital[0] : "Doesn't have";
      accum += `
      <li class="country-item">
        <div class="country-img">
        <img src="${png}" alt="${common}">
        </div>
        <div class="country-info">
          <h3 class="country-name font-m-b2">${common}</h3>
          <ul class="country-data font-p-b">
            <li>Population: <span>${population}</span></li>
            <li>Region: <span>${region}</span></li>
            <li>Capital: <span>${central}</span></li>
          </ul>
        </div>
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
    const modal = document.querySelector('[data-modal]');
    modal.dataset.modal = 'active';
    //document.body.style.overflowY = 'hidden';
    const dataCountry = getClickedCountry(e.currentTarget);
    getDataInModal(dataCountry);
  };
  
  function getClickedCountry(country) {
    const countryName = country.querySelector('.country-name').innerText;
    const clickedCountry = countries.find(({name:{common}}) => {
      return countryName === common;
    })
    return clickedCountry
  };

  function getDataInModal(country) {
    const {name:{common, nativeName}, flags:{svg}, population, region, subregion, capital, tld, currencies, languages} = country;

    const central = capital ? capital[0] : "Doesn't have";
    const topLevelDomain = tld ? tld[0] : "Doesn't have";
    const newSubregion = subregion ?? "Doesn't have";
    
    let gageName = "Doesn't have";
    let currency = "Doesn't have";
    let idiom = "";
  
    for(let x in nativeName) {
      gageName = nativeName[x].common;
      break;
    };
    for(let x in currencies) {
      currency = currencies[x].name;
      break;
    };
    for(let x in languages) {
      idiom += `${languages[x]}, `;
    };
    
    const newIdiom = idiom ? idiom.substring(0, idiom.length - 2) : "Doesn't have";

    const borderCountries = getBorderContruies(region);

    setDataInModal(svg, common, gageName, population, region, newSubregion, central, topLevelDomain, currency, newIdiom, borderCountries);
    
  };

  function setDataInModal(svg, name, gageName, population, region, subregion, capital, topLevelDomain, currency, languages, borderCountries) {
    const modalSvg = document.querySelector('.modal-img');
    const modalName = document.querySelector('.modal-name');
    const modalGageName = document.querySelector('.modal-native-name');
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
    modalGageName.innerText = gageName;
    modalPopulation.innerText = population;
    modalRegion.innerText = region;
    modalSubregion.innerText = subregion;
    modalCapital.innerText = capital;
    modalTopLevelDomain.innerText = topLevelDomain;
    modalCurrency.innerText = currency;
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
      const btnClicked = countries.find(({name:{common}}) => {
        return this.innerText === common;
      });

      const currentCountry = document.querySelector('.modal-name');
      console.log(this.innerText, currentCountry.innerText)
      if(this.innerText !== currentCountry.innerText) {
        modalContent.classList.add('active');
        setTimeout(() => {
          modalContent.classList.remove('active');
        }, 300);
      };

      getDataInModal(btnClicked);
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

    const countriesNames = top3CountriesPopulation.map(({ name: { common }}) => common)
    return countriesNames
  };

  const btnModalBack = document.querySelector('.country-modal-btn-back');

  btnModalBack.addEventListener('click', closeModal);

  function closeModal() {
    const modal = document.querySelector('[data-modal]');
    modal.dataset.modal = 'disabled';
    document.body.style.overflowY = 'visible';
  };

  //------------------------------------------------------------------

  const labelFilter = document.querySelector('.filter-label');
  labelFilter.addEventListener('click', openFilterModal);

  function openFilterModal() {
    labelFilter.classList.toggle('active');
  }

  //------------------------------------------------------

  const filterList = document.querySelectorAll('.filter-list li');

  filterList.forEach((region) => {
    region.addEventListener('click', filterRegion);
  });

  function filterRegion(e) {
    const filteredCountries = countries.filter(({region}) => {
      return e.currentTarget.id === region
    })
    addCountries(filteredCountries);
  }

  //---------------------------------------------

  const inputSearch = document.querySelector('#search');

  inputSearch.addEventListener('keypress', filterSearch);

  function filterSearch() {
    setTimeout(() => {
      const filteredSearch = countries.filter(({name:{common}}) => {
        const countryName = common.toLowerCase();
        const searchName  = inputSearch.value.toLowerCase();
        return countryName.startsWith(searchName)
      });
      addCountries(filteredSearch);
    }, 100);
  };

  //-----------------------------------------------------------------

  inputSearch.addEventListener('blur', resetSearch);

  function resetSearch() {
    const nations = document.querySelectorAll('.country-item');
    if(inputSearch.value === '' && nations.length === 0) {
      addCountries(countries);
    };
  }

};

workingCountries();