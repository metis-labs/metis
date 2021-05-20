import { v4 as uuidv4 } from 'uuid';
import { ConnectionStatus, Position } from './base';
import { Network, createNetwork } from './networks';

export type Project = {
  id: string;
  name: string;
  networks: { [networkID: string]: Network };
};

export type ProjectInfo = {
  id: string;
  name: string;
  createdAt: Date;
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
  id: string;
  color: string;
  image: string;
  username: string;
  status: ConnectionStatus;
  selectedNetworkID?: string;
  cursor: Position;
  isMine: boolean;
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

export function createProject(name: string): Project {
  const network = createNetwork(name);
  return {
    id: uuidv4(),
    name,
    networks: {
      [network.id]: network,
    },
  };
}
