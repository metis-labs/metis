import React, {useState, useCallback, useEffect} from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { CanvasWidget } from '@projectstorm/react-canvas-core';

import { Position } from "store/store";
import {DiagramEngine} from "components/DiagramEngine";
import {useFragment} from "../../index";

const useStyles = makeStyles(() =>
  createStyles({
    canvas: {
      marginTop: "64px",
      height: "calc(100vh - 64px)",
      backgroundColor: "#eaeaeb",
    },
  }),
);

export default function DiagramView() {
  const classes = useStyles();

  const [fragment, updateFragment] = useFragment();
  const [engine,] = useState(new DiagramEngine(fragment));
  const [lastFunction, setLastFunction] = useState<string>();
  const [lastBlockID, setLastBlockID] = useState<string>();
  const [lastPosition, setLastPosition] = useState<Position>();

  const handleMouseUp = useCallback((event: any) => {
    if (lastFunction === 'selectionChanged' && lastBlockID) {
      updateFragment((fragment) => {
        fragment.selectedBlockID = lastBlockID;
      });
    } else if (lastFunction === 'positionChanged' && lastBlockID) {
      updateFragment((fragment) => {
        fragment.blocks[lastBlockID].position = lastPosition;
        fragment.selectedBlockID = lastBlockID;
      });
    }
  }, [lastFunction, lastBlockID, lastPosition, updateFragment]);

  useEffect(() => {
    const deregister = engine.registerListener((event: any, blockID: string) => {
      setLastFunction(event.function);
      setLastBlockID(blockID);
      if (event.function === 'positionChanged') {
        setLastPosition(event.entity.position);
      }
    });

    return () => deregister();
  }, [setLastFunction, setLastBlockID, setLastPosition, engine]);

  return (
    <div onMouseUp={handleMouseUp}>
      <CanvasWidget
        className={classes.canvas}
        engine={engine.getDiagramEngine()}
      />
    </div>
  );
}
