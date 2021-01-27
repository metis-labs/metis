import * as React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import { MetisNodeModel } from 'components/DiagramView/MetisNodeModel';
import {BlockType} from "store/store";

export interface MetisNodeWidgetProps {
  node: MetisNodeModel;
  engine: DiagramEngine;
}

export interface MetisNodeWidgetState {}

export class MetisNodeWidget extends React.Component<MetisNodeWidgetProps, MetisNodeWidgetState> {
  constructor(props: MetisNodeWidgetProps) {
    super(props);
    this.state = {};
  }

  render() {
    const {node, engine} = this.props;

    return (
      <div>
        <div className={node.getOptions().selected ? "metis-node selected" : "metis-node"}>
          <div className="metis-node-type">{node.getBlockType()}</div>
          <div className="metis-node-name">{node.getName()}</div>
        </div>
        {
          node.getBlockType() !== BlockType.In && (
            <PortWidget className="metis-node-port-in" engine={engine} port={node.getInPort()}>
              <ArrowUpwardIcon className="circle-port" fontSize="inherit"/>
            </PortWidget>
          )
        }
        {
          node.getBlockType() !== BlockType.Out && (
            <PortWidget className="metis-node-port-out" engine={engine} port={node.getOutPort()}>
              <ArrowDownwardIcon className="circle-port" fontSize="inherit"/>
            </PortWidget>
          )
        }
      </div>
    );
  }
}
