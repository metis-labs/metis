export enum BlockType {
  In = 'In',
  Out = 'Out',
  Conv2d = 'Conv2d',
  ReLU = 'ReLU',
  MaxPool2d = 'MaxPool2d',
}

export const PreservedBlockTypes = new Set([BlockType.In, BlockType.Out]);

export type Position = {
  x: number;
  y: number;
};

export type PropertyValue = string | number | boolean;
export type Properties = { [key: string]: PropertyValue };

export type Block = {
  id: string;
  name: string;
  type: BlockType;
  position: Position;
  properties?: Properties;
};

export type Link = {
  from: string;
  to: string;
};

export type NetworkFragment = {
  blocks: { [id: string]: Block };
  links: Link[];
  selectedBlockID?: string;
};

export const EmptyNetworkFragment = {
  blocks: {},
  links: [],
};
