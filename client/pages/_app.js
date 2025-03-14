import withRedux from "next-redux-wrapper";
import App from "next/app";
import Router from 'next/router';
import { Provider } from "react-redux";
import '../node_modules/react-modal-video/scss/modal-video.scss';
import '../public/css/react-carousel.es.css';
import '../public/css/slick-override.css';
import "../public/nprogress.css";
import { initStore } from "../redux";
import GlobalErrorComponent from "../src/Components/GlobalErrorComponent";
import '../src/styles/livestream.scss';
import { initGAWithConsent, logPageView } from '../utils/analytics';

export default withRedux(initStore, { debug: false })(
  class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
      // Ensure store is initialized on server-side
      const pageProps = {
        ...(Component.getInitialProps
          ? await Component.getInitialProps(ctx)
          : {}),
      };

      return { pageProps };
    }

    componentDidMount() {
      if (typeof window !== 'undefined') {
        // Wait for DOM to be fully loaded
        window.addEventListener('load', () => {
          // Initialize GA with consent
          setTimeout(() => {
            initGAWithConsent();
            logPageView();
          }, 1000); // Give time for iubenda to initialize
        });

        // Add page view logging on route change
        Router.events.on('routeChangeComplete', (url) => {
          logPageView();
        });
      }
    }

    componentWillUnmount() {
      // Clean up event listener only on client-side
      if (typeof window !== 'undefined') {
        Router.events.off('routeChangeComplete', logPageView);
      }
    }

    render() {
      const { Component, pageProps, store } = this.props;
      return (
        <Provider store={store}>
          <GlobalErrorComponent {...this.props} />
          <Component {...pageProps} />
        </Provider>
      );
    }
  }
);
