export enum DiagramType {
  Main = 'Main',
  Module = 'Module',
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

export const IOBlockTypes = new Set([BlockType.In, BlockType.Out]);

export type Position = {
  x: number;
  y: number;
};

export type PropertyValue = string | number | boolean;
export type Properties = { [key: string]: PropertyValue };

// TODO subtyping: Block, NetworkBlock, NormalBlock
export type Block = {
  id: string;
  name: string;
  type: BlockType;
  position: Position;

  // Network
  initVariables?: string;
  refNetwork?: string;

  // Normal
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
  offset: Position;
  zoom: number;
  selectedBlockID?: string;
};

// TODO: Rename Model to Network
export type Model = {
  id: string;
  name: string;
  type: DiagramType;
  dependencies: { [id: string]: Dependency };
  blocks: { [id: string]: Block };
  links: { [id: string]: Link };
};

export type Project = {
  id: string;
  name: string;
  models: { [modelID: string]: Model };
};

export type ProjectInfo = {
  id: string;
  name: string;
};

export type LocalState = {
  diagramInfos: { [modelID: string]: DiagramInfo };
  projectInfos: { [projectID: string]: ProjectInfo };
  selectedModelID?: string;
};

export type PeerInfo = {
  color: string;
  image: string;
  username: string;
  selectedModelID?: string;
  cursor: Position;
};

export type AppState = {
  local: LocalState;
  peers: { [docID: string]: { [peerID: string]: PeerInfo } };
  repaintCounter: number; // TODO: repainting with mutable.
  peersRepaintCounter: number;
  client?: any; // TODO: compatibility issue with immer and Yorkie
  remote?: any; // TODO: compatibility issue with immer and Yorkie
};

export const EmptyModel = {
  id: '',
  name: '',
  type: DiagramType.Main,
  diagramInfo: {},
  dependencies: {},
  blocks: {},
  links: {},
};

type EntityType = 'model';
type ActionType = 'create' | 'delete';

export type EventDesc = {
  id: string;
  entityType: EntityType;
  actionType: ActionType;
};

export function encodeEventDesc(desc: EventDesc): string {
  return JSON.stringify(desc);
}

export function decodeEventDesc(desc: string): EventDesc {
  return JSON.parse(desc);
}
