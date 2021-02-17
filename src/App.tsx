import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import ProjectIntroPage from 'pages/ProjectIntroPage';
import ProjectPage from 'pages/ProjectPage';

import 'App.scss';

function App() {
  return (
    <Router>
      <Route path="/" exact component={ProjectIntroPage} />
      <Route path="/:projectID" exact component={ProjectPage} />
    </Router>
  );
}

export default App;
