import React from "react";
import createEngine, {
  DefaultLinkModel,
  DefaultNodeModel,
  DefaultPortModel,
  DiagramModel
} from '@projectstorm/react-diagrams';

import {
  CanvasWidget
} from '@projectstorm/react-canvas-core';
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { testModel} from "components/model";

const useStyles = makeStyles(() =>
  createStyles({
    canvas: {
      height: '100vh',
    },
  }),
);

// create an instance of the engine with all the defaults
const engine = createEngine();

const nodes = [];

interface NodeInfo {
  node: DefaultNodeModel;
  inPort: DefaultPortModel;
  outPort: DefaultPortModel;
}

const nodeInfoMap: {[key: string]: NodeInfo} = {};

for ( const block of testModel.blocks ) {
  const node = new DefaultNodeModel({
    name: block.name,
    color: 'rgb(0,192,255)',
  });
  node.setPosition(block.position.x, block.position.y);
  const inPort = node.addInPort('In');
  const outPort = node.addOutPort('Out');
  nodes.push(node);

  nodeInfoMap[block.id] = {node, inPort, outPort};
}

const links: Array<any> = [];

for (const link of testModel.links ) {
  const out = nodeInfoMap[link.from].outPort;
  const iin = nodeInfoMap[link.to].inPort;
  links.push(out.link<DefaultLinkModel>(iin));
}

const model = new DiagramModel();
model.addAll(...nodes, ...links);
engine.setModel(model);

export default function Canvas() {
  const classes = useStyles();

  return (
    <CanvasWidget className={ classes.canvas } engine={engine} />
  )
};
