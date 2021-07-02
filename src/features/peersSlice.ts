// Metis
// Copyright 2021-present NAVER Corp.
// Apache License v2.0

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Position = {
  x: number;
  y: number;
};

export enum ConnectionStatus {
  Connected = 'connected',
  Disconnected = 'disconnected',
}

export type Peer = {
  id: string;
  color: string;
  image: string;
  username: string;
  status: ConnectionStatus;
  selectedNetworkID?: string;
  cursor: Position;
  isMine: boolean;
};

type Peers = {
  [id: string]: Peer;
};

export interface PeersState {
  peers: Peers;
}

const peersSlice = createSlice({
  name: 'peers',
  initialState: { peers: {} } as PeersState,
  reducers: {
    updatePeers(state, action: PayloadAction<Peers>) {
      const { peers } = state;
      const modifiedPeers = action.payload;
      for (const id of Object.keys(state.peers)) {
        peers[id] = { ...peers[id], ...modifiedPeers[id] };
      }
    },
    patchPeers(
      state,
      action: PayloadAction<{
        myClientID: string;
        changedPeers: Peers;
      }>,
    ) {
      const { myClientID, changedPeers } = action.payload;
      const { peers } = state;

      for (const clientID of Object.keys(peers)) {
        if (!changedPeers[clientID]) {
          peers[clientID].status = ConnectionStatus.Disconnected;
        }
      }

      for (const [clientID, peer] of Object.entries(changedPeers || {})) {
        if (!peers[clientID] || peers[clientID].status === ConnectionStatus.Disconnected) {
          peers[clientID] = {
            id: clientID,
            status: ConnectionStatus.Connected,
            color: peer.color,
            image: peer.image,
            username: peer.username,
            selectedNetworkID: peer.selectedNetworkID,
            cursor: peer.cursor,
            isMine: myClientID === clientID,
          };
        }
      }
    },
  },
});

export const { updatePeers, patchPeers } = peersSlice.actions;
export default peersSlice.reducer;
