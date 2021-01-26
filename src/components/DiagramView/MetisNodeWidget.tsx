import * as React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';

import { MetisNodeModel } from 'components/DiagramView/MetisNodeModel';

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
        const { node } = this.props;
        return (
            <div>
                <PortWidget className="metis-node-port-in" engine={this.props.engine} port={this.props.node.getInPort()}>
                    <div className="circle-port" />
                </PortWidget>
                <div className="metis-node">
                    <div className="metis-node-type">{node.getBlockType()}</div>
                    <div className="metis-node-name">{node.getName()}</div>
                </div>
                <PortWidget className="metis-node-port-out" engine={this.props.engine} port={this.props.node.getOutPort()}>
                    <div className="circle-port" />
                </PortWidget>
            </div>
        );
    }
}