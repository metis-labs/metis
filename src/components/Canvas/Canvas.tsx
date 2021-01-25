import React, {useState, useEffect, useCallback, useMemo} from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { CanvasWidget } from '@projectstorm/react-canvas-core';

import { NetworkFragment, Block, Position } from "model/model";
import {DiagramApp} from "components/DiagramApp";

const useStyles = makeStyles(() =>
  createStyles({
    canvas: {
      height: "100vh",
    },
  }),
);

export default function Canvas(props: {
  fragment: NetworkFragment,
  count: number,
  setSelectedBlock: Function,
  app: DiagramApp
}) {
  const classes = useStyles();

  const { setSelectedBlock } = props;

  const [lastFunction, setLastFunction] = useState<string>();
  const [lastBlock, setLastBlock] = useState<Block>();
  const [lastPosition, setLastPosition] = useState<Position>();

  const handleMouseUp = useCallback((event: any) => {
    if (lastFunction === 'selectionChanged' && lastBlock) {
      setSelectedBlock(lastBlock);
    } else if (lastFunction === 'positionChanged' && lastBlock) {
      lastBlock.setPosition(lastPosition!.x, lastPosition!.y);
      setSelectedBlock(lastBlock);
    }
  }, [lastFunction, lastBlock, lastPosition, setSelectedBlock]);

  // TODO: Should find a way to resolve unexpected Canvas behavior
  // useMemo(() => {
  //   props.app.registerListener((event: any, block: Block) => {
  //     setLastFunction(event.function);
  //     setLastBlock(block);
  //     if (event.function === 'positionChanged') {
  //       setLastPosition(event.entity.position);
  //     }
  //   })
  // }, []);

  return (
    <div onMouseUp={handleMouseUp}>
      <CanvasWidget
        className={classes.canvas}
        engine={props.app.getDiagramEngine()}
      />
    </div>
  );
}
