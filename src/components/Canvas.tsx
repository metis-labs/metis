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

export default function Canvas(props: {fragment: NetworkFragment}) {
  const classes = useStyles();

  console.log(props.fragment.getBlocks().length)

  // create an instance of the engine with all the defaults
  const engine = createEngine();

  const nodes = [];

  interface NodeInfo {
    node: DefaultNodeModel;
    inPort: DefaultPortModel;
    outPort: DefaultPortModel;
  }

// model.key -> node
  const nodeInfoMap: {[key: string]: NodeInfo} = {};

// node.id -> model.key
  const modelKeyMap: {[key: string]: string} = {};

  for (const block of props.fragment.getBlocks()) {
    const node = new DefaultNodeModel({
      name: block.getName(),
      color: 'rgb(0,192,255)',
    });
    node.setPosition(block.getPosition().x, block.getPosition().y);
    const inPort = node.addInPort('In');
    const outPort = node.addOutPort('Out');
    nodes.push(node);

    nodeInfoMap[block.getID()] = {node, inPort, outPort};
    modelKeyMap[node.getID()] = block.getID();
  }

  const links: Array<any> = [];

  for (const link of props.fragment.getLinks() ) {
    const out = nodeInfoMap[link.from].outPort;
    const iin = nodeInfoMap[link.to].inPort;
    links.push(out.link<DefaultLinkModel>(iin));
  }

  const model = new DiagramModel();
  const models = model.addAll(...nodes, ...links);

  models.forEach((item) => {
    item.registerListener({
      eventDidFire: function(event: any) {
        const blockId = modelKeyMap[event.entity.getID()];
        const position = event.entity.position;
        for (const block of props.fragment.getBlocks()) {
          if (block.getID() === blockId) {
            block.setPosition(position.x, position.y);
            console.log(block.getPosition());
          }
        }
      },
    });
  });

  model.registerListener({
    eventDidFire: function () {
      console.log('model:', arguments[0].entity);
    }
  });

  engine.setModel(model);

  return (
    <CanvasWidget className={ classes.canvas } engine={engine} />
  )
};
