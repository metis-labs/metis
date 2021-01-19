import React from "react";
import createEngine, {
  DefaultLinkModel,
  DefaultNodeModel,
  DiagramModel
} from '@projectstorm/react-diagrams';

import {
  CanvasWidget
} from '@projectstorm/react-canvas-core';
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    canvas: {
      height: '100vh',
    },
  }),
  );

// create an instance of the engine with all the defaults
const engine = createEngine();

// node 1
const node1 = new DefaultNodeModel({
  name: 'Node 1',
  color: 'rgb(0,192,255)',
});
node1.setPosition(100, 100);
let port1 = node1.addOutPort('Out');

// node 2
const node2 = new DefaultNodeModel({
  name: 'Node 1',
  color: 'rgb(0,192,255)',
});
node2.setPosition(100, 100);
let port2 = node2.addOutPort('Out');

// link them and add a label to the link
const link = port1.link<DefaultLinkModel>(port2);
link.addLabel('Hello World!');

const model = new DiagramModel();
model.addAll(node1, node2, link);
engine.setModel(model);

export default function Canvas() {
  const classes = useStyles();

  return (
    <CanvasWidget className={ classes.canvas } engine={engine} />
  )
};
