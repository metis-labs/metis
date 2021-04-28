import * as React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import MetisNodeModel from 'components/DiagramView/MetisNodeModel';
import { BlockType, colorMap } from 'store/types/blocks';

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
    const { node, engine } = this.props;

    return (
      <div onDoubleClick={() => node.handleDoubleClick()}>
        <div
          className={node.getOptions().selected ? 'metis-node selected' : 'metis-node'}
          style={{
            color: 'white',
            backgroundColor: colorMap[node.getBlockType()],
          }}
        >
          <div className="metis-node-type">
            {node.getBlockType() === BlockType.Network ? node.getRefNetworkName() : node.getBlockType()}
          </div>
          <div className="metis-node-name">{node.getName()}</div>
          {node.getRepeats() > 1 && <div className="metis-node-repeats">x{node.getRepeats()}</div>}
        </div>
        {node.getBlockType() !== BlockType.In && (
          <PortWidget className="metis-node-port-in" engine={engine} port={node.getInPort()}>
            <KeyboardArrowUpIcon className="circle-port" fontSize="inherit" />
          </PortWidget>
        )}
        {node.getBlockType() !== BlockType.Out && (
          <PortWidget className="metis-node-port-out" engine={engine} port={node.getOutPort()}>
            <KeyboardArrowDownIcon className="circle-port" fontSize="inherit" />
          </PortWidget>
        )}
      </div>
    );
  }
}
