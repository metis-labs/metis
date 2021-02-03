import { NodeModel, PortModelAlignment } from '@projectstorm/react-diagrams';
import { BaseModelOptions } from '@projectstorm/react-canvas-core';

import { BlockType } from 'store/types';
import { MetisPortModel } from './MetisPortModel';

export interface MetisNodeModelOptions extends BaseModelOptions {
  blockID: string;
  blockType: BlockType;
  name: string;
  repeats: number;
}

export class MetisNodeModel extends NodeModel {
  private readonly blockID: string;
  private blockType: BlockType;
  private name: string;
  private readonly repeats: number;
  private readonly inPort?: MetisPortModel;
  private readonly outPort?: MetisPortModel;

  constructor(options: MetisNodeModelOptions) {
    super({
      ...options,
      type: 'metis-node',
    });
    this.blockID = options.blockID;
    this.blockType = options.blockType;
    this.name = options.name;
    this.repeats = options.repeats;

    if (this.blockType !== BlockType.In) {
      this.inPort = new MetisPortModel({
        in: true,
        name: 'in',
        alignment: PortModelAlignment.TOP,
      });
      this.addPort(this.inPort);
    }

    if (this.blockType !== BlockType.Out) {
      this.outPort = new MetisPortModel({
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

  getInPort(): MetisPortModel {
    return this.inPort;
  }

  getOutPort(): MetisPortModel {
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

  getRepeats() {
    return this.repeats;
  }
}
