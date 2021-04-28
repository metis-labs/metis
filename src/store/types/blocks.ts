import operatorMetaInfos from 'converter/pytorch-metadata.json';
import printParamValue from 'converter/parameterConverter';
import { Position } from './base';

export type ParameterValue = string | number | boolean;
export type Parameters = { [key: string]: ParameterValue };

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

export function createParams(type: BlockType): Parameters {
  const parameters = {};
  const meta = operatorMetaInfos.find((meta) => meta.abbrev === type);
  for (const parameter of meta.schema.attributes) {
    parameters[parameter.name] = printParamValue(parameter.default);
  }
  return parameters;
}

export enum BlockType {
  In = 'In',
  Out = 'Out',
  Network = 'Network',
  Conv2d = 'Conv2d',
  BatchNorm2d = 'BatchNorm2d',
  ReLU = 'ReLU',
  MaxPool2d = 'MaxPool2d',
}

export const colorMap: { [key: string]: string } = {
  In: '#808080',
  Out: '#808080',
  Network: '#4C62F6',
  Conv2d: '#EE3F46',
  BatchNorm2d: '#0D5259',
  ReLU: '#F47D23',
  MaxPool2d: '#BE2C8F',
};

export function isIOBlockType(blockType: BlockType): boolean {
  return [BlockType.In, BlockType.Out].includes(blockType);
}

export function isNetworkBlockType(blockType: BlockType): boolean {
  return BlockType.Network === blockType;
}

export function isNormalBlockType(blockType: BlockType): boolean {
  return ![BlockType.In, BlockType.Out, BlockType.Network].includes(blockType);
}

export type Block = NormalBlock | NetworkBlock | IOBlock;

export interface BaseBlock {
  id: string;
  name: string;
  type: BlockType;
  position: Position;
}

export interface IOBlock extends BaseBlock {
  type: BlockType.In | BlockType.Out;
  initVariables: string;
}

export interface NetworkBlock extends BaseBlock {
  type: BlockType.Network;
  refNetwork: string;
  repeats: number;
  parameters: Parameters;
}

export interface NormalBlock extends BaseBlock {
  type: BlockType.Conv2d | BlockType.BatchNorm2d | BlockType.ReLU | BlockType.MaxPool2d;
  repeats: number;
  parameters: Parameters;
}
