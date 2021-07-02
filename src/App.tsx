// Metis
// Copyright 2021-present NAVER Corp.
// Apache License v2.0

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'app/store';

import ProjectIntroPage from 'pages/ProjectIntroPage';
import ProjectPage from 'pages/ProjectPage';

import AppStateInitializer from 'AppStateInitializer';
import 'App.scss';

function App() {
  return (
    <Provider store={store}>
      <AppStateInitializer />
      <Router>
        <Route path="/" exact component={ProjectIntroPage} />
        <Route path="/:projectID" exact component={ProjectPage} />
      </Router>
    </Provider>
  );
}

export default App;
