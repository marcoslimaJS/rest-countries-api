function darkTheme () {
  const btnDark = document.querySelector('.dark-mode');
  const theme = window.localStorage.getItem('theme');

  theme === 'dark' ? document.body.classList.add('dark'): '';

  btnDark.addEventListener('click', darkMode);

  function darkMode() {
    document.body.classList.toggle('dark');
    if(theme === 'dark') {
      window.localStorage.setItem("theme", "light")
    } else {
      window.localStorage.setItem("theme", "dark")
    }
  };
};

darkTheme();