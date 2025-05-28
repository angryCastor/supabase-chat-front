const screenFix = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

export default () => {
  window.addEventListener('resize', screenFix)
  window.addEventListener('scroll', screenFix)
  screenFix()
}
