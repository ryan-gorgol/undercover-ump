import '../styles/globals.css'
import '../styles/normalize.css'

import type { AppProps } from 'next/app'

const MyApp = ({ Component, pageProps }: AppProps) => {

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