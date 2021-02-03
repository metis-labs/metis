export enum DiagramType {
  Main = 'Main',
  Module = 'Module',
}

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
  repeats?: number;
  parameters?: Properties;
};

export type Link = {
  id: string;
  from: string;
  to: string;
};

export type Dependency = {
  id: string;
  name: string;
  alias?: string;
  package?: string;
};

export type DiagramInfo = {
  id: string;
  name: string;
  type: DiagramType;
  offset?: Position;
  zoom?: number;
};

export type NetworkFragment = {
  diagramInfo: DiagramInfo;
  dependencies: { [id: string]: Dependency };
  blocks: { [id: string]: Block };
  links: { [id: string]: Link };
  selectedBlockID?: string;
};

export type Project = {
  id: string;
  name: string;
  fragments: { [fragmentId: string]: NetworkFragment };
  selectedFragmentId: string;
};

export const EmptyNetworkFragment = {
  diagramInfo: {
    id: '',
    name: '',
    type: DiagramType.Main,
  },
  dependencies: {},
  blocks: {},
  links: {},
};
