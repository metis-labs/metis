import { NodeModel, DefaultPortModel } from '@projectstorm/react-diagrams';
import { BaseModelOptions } from '@projectstorm/react-canvas-core';

import { BlockType } from 'model/model';

export interface MetisNodeModelOptions extends BaseModelOptions {
  blockType: BlockType;
  name: string;
}

export class MetisNodeModel extends NodeModel {
  private blockType: BlockType;
  private name: string;
  private readonly inPort: DefaultPortModel;
  private readonly outPort: DefaultPortModel;

  constructor(options: MetisNodeModelOptions) {
    super({
      ...options,
      type: 'metis-node',

    });
    this.blockType = options.blockType;
    this.name = options.name;

    this.inPort = new DefaultPortModel({ in: true, name: 'in' });
    this.outPort = new DefaultPortModel({ in: false, name: 'out' })
    this.addPort(this.inPort);
    this.addPort(this.outPort);
  }

  getName(): string {
    return this.name;
  }

  getBlockType(): BlockType {
    return this.blockType;
  }

  getInPort(): DefaultPortModel {
    return this.inPort;
  }

  getOutPort(): DefaultPortModel {
    return this.outPort;
  }

  serialize() {
    return {
      ...super.serialize(),
      blockType: this.blockType,
      name: this.name,
    }
  }

  deserialize(event: any): void {
    super.deserialize(event);
    this.blockType = event.data.blockType as BlockType;
    this.name = event.data.name as string;
  }
}
