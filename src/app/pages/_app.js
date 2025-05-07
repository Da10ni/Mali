import { useEffect } from 'react';
import { hotjar } from 'hotjar-react';
import { withSentry } from '@sentry/nextjs';
import ReactGA from 'react-ga';
import ReactGTM from 'react-gtm-module';
import mixpanel from 'mixpanel-browser';
import { initMixpanel } from '../lib/mixpanel'
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize Google Tag Manager
    ReactGTM.initialize({ gtmId: 'GTM-XXXX' }); //After domain

    // Initialize Google Analytics
    ReactGA.initialize('UA-XXXXXX-X'); //After domain
    ReactGA.pageview(window.location.pathname + window.location.search);

    // Initialize Hotjar (Replace 1234567 with your Hotjar ID)
    hotjar.initialize(1234567, 6); //After domain (6 is version)

    mixpanel.init('878eecac072c9b31d571ce20e53ec03c', { debug: true });

    // Track page view with Mixpanel
    mixpanel.track('Page View', {
      page: window.location.pathname + window.location.search,
    });
    initMixpanel();
  }, []); 

  return <Component {...pageProps} />;
}

export default withSentry(MyApp);
