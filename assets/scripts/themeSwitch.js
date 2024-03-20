// Variables
const moon = document.getElementById('themeSwitcherMoon')
const sun = document.getElementById('themeSwitcherSun')
var theme = "light"

// Show the moon symbol
function moonShow() {
  sun.style.display = "none"
  moon.style.display = "block"
}

// Show the sun symbol
function sunShow() {
  moon.style.display = "none"
  sun.style.display = "block"
}


// Check if user prefers dark mode
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  themeSwitch()
}

// Swap between light and dark mode
function themeSwitch() {
  if (theme == "light") {
    document.documentElement.setAttribute('data-theme', 'dark')
    theme = "dark"
    sunShow()
  } else {
    document.documentElement.removeAttribute('data-theme')
    theme = "light"
    moonShow()
  }
}
