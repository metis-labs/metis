import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { GenerateModelEvent } from '@projectstorm/react-canvas-core/src/core/AbstractModelFactory';

import MetisNodeModel, { MetisNodeModelOptions } from 'components/DiagramView/MetisNodeModel';
import { MetisNodeWidget } from 'components/DiagramView/MetisNodeWidget';

export default class MetisNodeFactory extends AbstractReactFactory<MetisNodeModel, DiagramEngine> {
  constructor() {
    super('metis-node');
  }

  generateModel(initialConfig: GenerateModelEvent): MetisNodeModel {
    return new MetisNodeModel(initialConfig.initialConfig as MetisNodeModelOptions);
  }

  generateReactWidget(event: any): JSX.Element {
    return <MetisNodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
  }
}
