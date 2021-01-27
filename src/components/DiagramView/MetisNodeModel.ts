import { DefaultPortModel, NodeModel, PortModelAlignment } from '@projectstorm/react-diagrams';
import { BaseModelOptions } from '@projectstorm/react-canvas-core';

import { BlockType } from 'store/store';

export interface MetisNodeModelOptions extends BaseModelOptions {
  blockID: string;
  blockType: BlockType;
  name: string;
}

export class MetisNodeModel extends NodeModel {
  private readonly blockID: string;
  private blockType: BlockType;
  private name: string;
  private readonly inPort?: DefaultPortModel;
  private readonly outPort?: DefaultPortModel;

  constructor(options: MetisNodeModelOptions) {
    super({
      ...options,
      type: 'metis-node',
    });
    this.blockID = options.blockID;
    this.blockType = options.blockType;
    this.name = options.name;

    if (this.blockType !== BlockType.In) {
      this.inPort = new DefaultPortModel({
        in: true,
        name: 'in',
        alignment: PortModelAlignment.TOP,
      });
      this.addPort(this.inPort);
    }

    if (this.blockType !== BlockType.Out) {
      this.outPort = new DefaultPortModel({
        in: false,
        name: 'out',
        alignment: PortModelAlignment.BOTTOM,
      });
      this.addPort(this.outPort);
    }
  }

  getName(): string {
    return this.name;
  }

  getBlockID(): string {
    return this.blockID;
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
    };
  }

  deserialize(event: any): void {
    super.deserialize(event);
    this.blockType = event.data.blockType as BlockType;
    this.name = event.data.name as string;
  }
}
