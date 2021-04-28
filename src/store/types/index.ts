import { Position } from './base';
import { Network } from './networks';

export type Project = {
  id: string;
  name: string;
  networks: { [networkID: string]: Network };
};

export type ProjectInfo = {
  id: string;
  name: string;
};

export type DiagramInfo = {
  offset: Position;
  zoom: number;
  selectedBlockID?: string;
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
  remoteRepaintCounter: number;
  peersRepaintCounter: number;

  // TODO: compatibility issue with immer and Yorkie
  // client: Client;
  client?: any;

  // TODO: compatibility issue with immer and Yorkie
  // remote: Document<{project: Project}>;
  remote?: any;
};
