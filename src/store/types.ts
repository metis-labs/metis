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

export function isNormalBlockType(blockType: BlockType): boolean {
  return ![BlockType.In, BlockType.Out, BlockType.Network].includes(blockType);
}

export type Position = {
  x: number;
  y: number;
};

export type PropertyValue = string | number | boolean;
export type Properties = { [key: string]: PropertyValue };

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
  parameters: Properties;
}

export interface NormalBlock extends BaseBlock {
  type: BlockType.Conv2d | BlockType.BatchNorm2d | BlockType.ReLU | BlockType.MaxPool2d;
  repeats: number;
  parameters: Properties;
}

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

export type Network = {
  id: string;
  name: string;
  dependencies: { [id: string]: Dependency };
  blocks: { [id: string]: Block };
  links: { [id: string]: Link };
};

export type Project = {
  id: string;
  name: string;
  networks: { [networkID: string]: Network };
};

export type ProjectInfo = {
  id: string;
  name: string;
};

export type LocalState = {
  diagramInfos: { [networkID: string]: DiagramInfo };
  projectInfos: { [projectID: string]: ProjectInfo };
  selectedNetworkID?: string;
};

export type PeerInfo = {
  color: string;
  image: string;
  username: string;
  selectedNetworkID?: string;
  cursor: Position;
};

export type AppState = {
  local: LocalState;
  peers: { [docID: string]: { [peerID: string]: PeerInfo } };
  repaintCounter: number;
  peersRepaintCounter: number;
  client?: any; // TODO: compatibility issue with immer and Yorkie
  remote?: any; // TODO: compatibility issue with immer and Yorkie
};

export const EmptyNetwork = {
  id: '',
  name: '',
  diagramInfo: {},
  dependencies: {},
  blocks: {},
  links: {},
};

type EntityType = 'network';
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
