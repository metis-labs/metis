import { Block, NormalBlock, IOBlock, BlockType, Network, EmptyNetwork, Properties, Project } from '../store/types';
import operatorMetaInfos from './pytorch-metadata.json';

export function printOptionValue(value: any): string {
  if (value === 'true' || value === 'True') {
    return 'True';
  }
  if (value === 'false' || value === 'False') {
    return 'False';
  }
  if (typeof value === 'string') {
    return `${value}`;
  }
  return JSON.stringify(value);
}

export function createNetworkParams(network: Network): Properties {
  const parameters = {};
  for (const block of Object.values(network.blocks)) {
    if (block.type === BlockType.In) {
      const ioBlock = block as IOBlock;
      if (!ioBlock.initVariables) {
        continue;
      }
      for (const variable of ioBlock.initVariables.split(',')) {
        parameters[variable] = '';
      }
    }
  }
  return parameters;
}

// TODO: extract this method
export function createParams(type: BlockType): Properties {
  const parameters = {};
  const meta = operatorMetaInfos.find((meta) => meta.abbrev === type);
  for (const parameter of meta.schema.attributes) {
    parameters[parameter.name] = printOptionValue(parameter.default);
  }
  return parameters;
}

// TODO: extract this method
export function getOrderedParamNames(type: BlockType): string[] {
  const operatorMetaInfo = operatorMetaInfos.find((metaInfo) => metaInfo.abbrev === type);
  const paramNames = [];
  if (!operatorMetaInfo || !operatorMetaInfo.schema) {
    return paramNames;
  }
  for (const parameter of operatorMetaInfo.schema.attributes) {
    paramNames.push(parameter.name);
  }
  return paramNames;
}

export default class InitConverter {
  private blocks: { [id: string]: Block };

  private readonly bodyBlockIDs: string[];

  private readonly inBlockIDs: string[];

  private readonly outBlockIDs: string[];

  private result: string;

  private readonly indentSize: string;

  private readonly indentDepth: number;

  private options: string;

  constructor() {
    this.blocks = EmptyNetwork.blocks;
    this.bodyBlockIDs = [];
    this.inBlockIDs = [];
    this.outBlockIDs = [];
    this.result = `\n\n`;
    this.indentSize = `    `;
    this.indentDepth = 1;
    this.options = '';
  }

  orderedBlockList(blocks: { [id: string]: Block }): void {
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

  updateInitFront(network: Network): void {
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

  updateInitBody(project: Project, blocks: { [id: string]: Block }): void {
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
        options.push(`${printOptionValue(paramValue)}`);
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
          options.push(`${parameter.name}=${printOptionValue(paramValue)}`);
        } else {
          options.push(`${printOptionValue(paramValue)}`);
        }
      }
    }
    this.result += options.join(', ');
  }

  getResult(): string {
    return this.result;
  }
}
