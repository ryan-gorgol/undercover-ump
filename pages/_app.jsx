import '../styles/globals.css'
import '../styles/normalize.css'

const MyApp = ({ Component, pageProps }) => {

  if (typeof window !== 'undefined') {

    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    let vw = window.innerWidth * 0.01
    document.documentElement.style.setProperty('--vw', `${vw}px`)

    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
      let vw = window.innerWidth * 0.01
      document.documentElement.style.setProperty('--vw', `${vw}px`)
    });
  }
  
  return (
      <Component {...pageProps} />
  );
};

export default MyApp;