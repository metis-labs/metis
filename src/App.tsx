import React, {useState} from 'react';
import {createStyles, makeStyles} from "@material-ui/core/styles";

import NavBar from "components/NavBar";
import SideBar from "components/SideBar";
import Canvas from "components/Canvas";

import 'App.css';
import testFragment from 'model/testNetworFragment';
import {Block, BlockType} from 'model/model';
import PropertyBar from "components/PropertyBar";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
    },
    content: {
      flexGrow: 1,
    },
  }),
);

function App() {
  const classes = useStyles();
  const [fragment, setFragment] = useState(testFragment);
  // TODO: need to use immutability for copy
  const [count, setCount] = useState(1);

  const addBlock = () => {
    const len = fragment.getBlocks().length;
    // TODO: Block should be repainted when push the button
    setCount(count + 1);
    fragment.addBlock(new Block(
      `${len + 1}`,
      `test_${len + 1}`,
      BlockType.Conv2d,
      {x: 100 + 10 * len, y: 100 + 10 * len},
    ));
    console.log(len);

    setFragment(fragment);
  };

  return (
    <div className={classes.root}>
      <NavBar/>
      <SideBar
        addBlock={addBlock}
      />
      <main className={classes.content}>
        <Canvas
          fragment={fragment}
          count={count}
        />
      </main>
      <PropertyBar />
    </div>
  );
}

export default App;
