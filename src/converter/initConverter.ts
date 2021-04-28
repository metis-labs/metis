import { Block, NormalBlock, IOBlock, BlockType } from 'store/types/blocks';
import { Network } from 'store/types/networks';
import { Project } from 'store/types';

import printParamValue from './parameterConverter';
import operatorMetaInfos from './pytorch-metadata.json';

export default class InitConverter {
  private blocks: { [id: string]: Block };

  private readonly bodyBlockIDs: string[];

  private readonly inBlockIDs: string[];

  private readonly outBlockIDs: string[];

  private result: string;

  private readonly indentSize: string;

  private readonly indentDepth: number;

  constructor() {
    this.blocks = {};
    this.bodyBlockIDs = [];
    this.inBlockIDs = [];
    this.outBlockIDs = [];
    this.result = `\n\n`;
    this.indentSize = `    `;
    this.indentDepth = 1;
  }

  orderBlocks(blocks: { [id: string]: Block }): void {
    for (const [, blockItem] of Object.entries(blocks)) {
      if (blockItem.type === BlockType.In) {
        this.inBlockIDs.push(blockItem.id);
      } else if (blockItem.type === BlockType.Out) {
        this.outBlockIDs.push(blockItem.id);
      } else {
        this.bodyBlockIDs.push(blockItem.id);
      }
    }
  }

  updateSignature(network: Network): void {
    this.result = `\n\n`;
    this.result += `class ${network.name}(nn.Module):\n`;
    this.result += this.indentSize;
    this.result += `def __init__(self`;
    this.inBlockIDs.forEach((inBlockID) => {
      const block = network.blocks[inBlockID] as IOBlock;
      if (block.initVariables) {
        block.initVariables.split(',').forEach((initVariable) => {
          this.result += `, ${initVariable}`;
        });
      }
    });
    this.result += `):\n`;
    for (let i = 0; i < this.indentDepth + 1; i += 1) {
      this.result += this.indentSize;
    }
    this.result += `super(${network.name}, self).__init__()\n`;
  }

  updateBody(project: Project, blocks: { [id: string]: Block }): void {
    this.result += `\n`;
    for (const blockID of this.bodyBlockIDs) {
      for (let i = 0; i < this.indentDepth + 1; i += 1) {
        this.result += this.indentSize;
      }
      const block = blocks[blockID];
      if (block.type === BlockType.Network) {
        this.result += `self.${block.name} = ${project.networks[block.refNetwork].name}(`;
      } else {
        this.result += `self.${block.name} = nn.${block.type}(`;
      }
      this.updateParameters(block);
      this.result += `) \n`;
    }
  }

  updateParameters(block: Block): void {
    const options = [];
    if (block.type === BlockType.Network) {
      for (const paramValue of Object.values(block.parameters)) {
        options.push(`${printParamValue(paramValue)}`);
      }
    } else {
      const normalBlock = block as NormalBlock;
      const idx = operatorMetaInfos.findIndex((metaInfo) => metaInfo.abbrev === normalBlock.type);
      for (const parameter of operatorMetaInfos[idx].schema.attributes) {
        const paramValue = normalBlock.parameters[parameter.name];
        // TODO: Need convert function to validate equality between default-value and assigned-value
        if (parameter.default === paramValue) {
          continue;
        }
        if (parameter.visible !== false) {
          options.push(`${parameter.name}=${printParamValue(paramValue)}`);
        } else {
          options.push(`${printParamValue(paramValue)}`);
        }
      }
    }
    this.result += options.join(', ');
  }

  getResult(): string {
    return this.result;
  }
}
