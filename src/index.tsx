import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import reportWebVitals from 'reportWebVitals';
import App from 'App';
import theme from 'theme';
import { createStore } from 'store/store';
import testProject from 'store/testFragment';

import 'index.css';

const ProjectStore = createStore(testProject);
export const useProject = ProjectStore.useProject;

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ProjectStore.Provider>
      <App />
    </ProjectStore.Provider>
  </ThemeProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
