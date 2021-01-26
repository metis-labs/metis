import React, {useState, useCallback, useMemo} from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { CanvasWidget } from '@projectstorm/react-canvas-core';

import { NetworkFragment, Block, Position } from "model/model";
import {DiagramEngine} from "components/DiagramEngine";

const useStyles = makeStyles(() =>
  createStyles({
    canvas: {
      height: "100vh",
      backgroundColor: "#eaeaeb",
    },
  }),
);

export default function DiagramView(props: {
  fragment: NetworkFragment,
  count: number,
  setSelectedBlock: Function,
  engine: DiagramEngine
}) {
  const classes = useStyles();

  const { setSelectedBlock, engine } = props;
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

  useMemo(() => {
    engine.registerListener((event: any, block: Block) => {
      setLastFunction(event.function);
      setLastBlock(block);
      if (event.function === 'positionChanged') {
        setLastPosition(event.entity.position);
      }
    })
  }, [setLastFunction, setLastBlock, setLastPosition, engine]);

  return (
    <div onMouseUp={handleMouseUp}>
      <CanvasWidget
        className={classes.canvas}
        engine={props.engine.getDiagramEngine()}
      />
    </div>
  );
}
