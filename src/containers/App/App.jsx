import React, { Fragment } from 'react';
import { connect, Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import '../../scss/app.scss';
import PropTypes from 'prop-types';
import Router from './Router';
import store from './store';
import ScrollToTop from './ScrollToTop';
import { config as i18nextConfig } from '../../translations';
import Auth0Provider from '../../shared/components/auth/withAuth0';
import IdleTimer from 'react-idle-timer'

i18n.init(i18nextConfig);

const ThemeComponent = ({ children, themeName }) => {
  const theme = createMuiTheme({
    palette: {
      type: themeName === 'theme-dark' ? 'dark' : 'light',
    },
  });
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};
ThemeComponent.propTypes = {
  children: PropTypes.shape().isRequired,
  themeName: PropTypes.string.isRequired,
};

const ConnectedThemeComponent = connect(state => ({ themeName: state.theme.className }))(ThemeComponent);


const App = () => {
  // eslint-disable-next-line
  const [loading, setLoading] = React.useState(true);
  // eslint-disable-next-line
  const [loaded, setLoaded] = React.useState(false);

  let idleTimer = null;

  React.useEffect(() => {
    window.addEventListener('load', () => {
      setLoading(false);
      setTimeout(() => setLoaded(true), 100);
    });
  }, []);

  const onRedirectCallbackAuth0 = (appState) => {
    window.history.replaceState(
      {},
      document.title,
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname,
    );
  }


  const handleOnAction = (event) => {
    console.log('user did something', event)
  }

  const handleOnActive = (event) => {
    console.log('user is active', event)
    console.log('time remaining', idleTimer.getRemainingTime())
  }

  const handleOnIdle = (event) => {
    console.log('user is idle', event)
    console.log('last active', idleTimer.getLastActiveTime())
    window.location.href = "/";
    localStorage.removeItem('token');
  }
  return (
    <Provider store={store}>
      <Auth0Provider
        // domain={auth0Config.domain}
        // clientId={auth0Config.clientId}
        // redirectUri={`${window.location.origin}/luckybox/dashboard_default`}
        // returnTo={`${window.location.origin}/luckybox/dashboard_default`}
        onRedirectCallback={onRedirectCallbackAuth0}
      >
        <BrowserRouter >
          <I18nextProvider>
            <ScrollToTop>
              <Fragment>
                <ConnectedThemeComponent>
                  <IdleTimer
                    ref={ref => { idleTimer = ref }}
                    timeout={1000 * 60 * 15}
                    onActive={handleOnActive}
                    onIdle={handleOnIdle}
                    onAction={handleOnAction}
                    debounce={250}
                  />
                  <Router />
                </ConnectedThemeComponent>
              </Fragment>
            </ScrollToTop>
          </I18nextProvider>
        </BrowserRouter>
      </Auth0Provider>
    </Provider>
  );

}
export default App;
