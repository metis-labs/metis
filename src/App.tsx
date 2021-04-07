import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import ProjectIntroPage from 'pages/ProjectIntroPage';
import ProjectPage from 'pages/ProjectPage';
import createStore from 'store/store';

import AppStateInitializer from 'AppStateInitializer';
import 'App.scss';

const AppStateStore = createStore({
  repaintCounter: 0,
  peersRepaintCounter: 0,
  local: {
    diagramInfos: {},
    projectInfos: {},
  },
  peers: {},
});
export const { useAppState } = AppStateStore;

function App() {
  return (
    <AppStateStore.Provider>
      <AppStateInitializer />
      <Router>
        <Route path="/" exact component={ProjectIntroPage} />
        <Route path="/:projectID" exact component={ProjectPage} />
      </Router>
    </AppStateStore.Provider>
  );
}

export default App;
