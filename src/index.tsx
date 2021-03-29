import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import reportWebVitals from 'reportWebVitals';
import App from 'App';
import theme from 'theme';
import createStore from 'store/store';

import 'index.css';

// TODO(youngteac.hong): we need to store below state to local storage.
const AppStateStore = createStore({
  repaintCounter: 0,
  peersRepaintCounter: 0,
  local: {
    diagramInfos: {},
    projectInfos: {},
  },
  peers: {},
});
const { useAppState } = AppStateStore;
export default useAppState;

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AppStateStore.Provider>
      <App />
    </AppStateStore.Provider>
  </ThemeProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
