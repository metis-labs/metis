import React, {useState, useEffect, useCallback} from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import createEngine, {
  DefaultLinkModel,
  DefaultNodeModel,
  DefaultPortModel,
  DiagramModel,
  DiagramEngine
} from '@projectstorm/react-diagrams';
import {
  CanvasWidget
} from '@projectstorm/react-canvas-core';
import {NetworkFragment, Block, Position} from "../model/model";

const useStyles = makeStyles(() =>
  createStyles({
    canvas: {
      height: '100vh',
    },
  }),
);

interface NodeInfo {
  node: DefaultNodeModel;
  inPort: DefaultPortModel;
  outPort: DefaultPortModel;
}

export default function Canvas(props: {
  fragment: NetworkFragment,
  count: number,
  setSelectedBlock: Function,
}) {
  const classes = useStyles();

  const {fragment, setSelectedBlock, count} = props;

  const [engine, setEngine] = useState<DiagramEngine>();
  const [lastFunction, setLastFunction] = useState<string>();
  const [lastBlock, setLastBlock] = useState<Block>();
  const [lastPosition, setLastPosition] = useState<Position>();

  useEffect(() => {
    const engine = createEngine();

    const nodes = [];
    const nodeInfoMap: {[key: string]: NodeInfo} = {};
    const modelKeyMap: {[key: string]: string} = {};
  
    for (const block of fragment.getBlocks()) {
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
  
    const links: Array<DefaultLinkModel> = [];
  
    for (const link of fragment.getLinks() ) {
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
          const block = fragment.getBlock(blockId);
  
          setLastFunction(event.function);
          setLastBlock(block);
          if (event.function === 'positionChanged') {
            setLastPosition(event.entity.position);
          }
        },
      });
    });

    engine.setModel(model);
    setEngine(engine);
  }, [fragment, count, setSelectedBlock, setLastPosition, setLastFunction, setLastBlock]);

  const handleMouseUp = useCallback((event: any) => {
    if (lastFunction === 'selectionChanged' && lastBlock) {
      setSelectedBlock(lastBlock);
    } else if (lastFunction === 'positionChanged' && lastBlock) {
      lastBlock.setPosition(lastPosition!.x, lastPosition!.y);
      setSelectedBlock(lastBlock);
    }
  }, [lastFunction, lastBlock, lastPosition]);

  return (
    <div onMouseUp={handleMouseUp}>
      {engine && <CanvasWidget className={classes.canvas} engine={engine!} />}
    </div>
  )
}
