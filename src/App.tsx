import React from 'react';
import 'App.css';
import NavBar from "components/NavBar";
import SideBar from "components/SideBar";
import {createStyles, makeStyles } from "@material-ui/core/styles";
import Canvas from "components/Canvas";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

function App() {
    const classes = useStyles();

  return (
    <div className={classes.root}>
      <NavBar/>
      <SideBar
        addBlock={addBlock}
      />
      <main className={classes.content}>
        <Canvas
          fragment={fragment}
        />
      </main>
    </div>
  );
}

export default App;
