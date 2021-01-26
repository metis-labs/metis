import React, {useState} from 'react';
import {createStyles, makeStyles} from "@material-ui/core/styles";

import NavBar from "components/NavBar";
import SideBar from "components/SideBar";
import DiagramView from "components/DiagramView";

import 'App.css';
import testFragment from 'model/testNetworkFragment';
import {Block, BlockType} from 'model/model';
import PropertyBar from "components/PropertyBar";
import { DiagramEngine } from 'components/DiagramEngine';

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
  const [count, setCount] = useState(1); // TODO: need to use immutability for copy
  const [selectedBlock, setSelectedBlock] = useState(undefined);
  const [engine, setEngine] = useState(new DiagramEngine(fragment));
  // const addBlock = () => {
  //   const len = fragment.getBlocks().length;
  //   // TODO: Block should be repainted when push the button
  //   setCount(count + 1);
  //   fragment.addBlock(new Block(
  //     `${len + 1}`,
  //     `test_${len + 1}`,
  //     BlockType.Conv2d,
  //     {x: 100 + 10 * len, y: 100 + 10 * len},
  //   ));
  //
  //   setFragment(fragment);
  // };

  const addBlock = (): void => {
  //   console.log(engine.addNode());
    // return engine.addNode();
  };

  return (
    <div className={classes.root}>
      <NavBar/>
      <SideBar
        addBlock={addBlock}
      />
      <main className={classes.content}>
        <DiagramView
          fragment={fragment}
          count={count}
          setSelectedBlock={setSelectedBlock}
          engine={engine}
        />
      </main>
      {selectedBlock && <PropertyBar selectedBlock={selectedBlock!}/>}
    </div>
  );
}

export default App;
