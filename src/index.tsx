import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import reportWebVitals from 'reportWebVitals';
import App from 'App';
import theme from "theme";
import { createStore } from 'store/store';
import testFragment from 'store/testNetworkFragment';

import 'index.css';

const FragmentStore = createStore(testFragment);
export const useFragment = FragmentStore.useStore;

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <FragmentStore.Provider>
      <App />
    </FragmentStore.Provider>
  </ThemeProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
