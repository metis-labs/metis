import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Peer } from 'store/types';
import { ConnectionStatus } from 'store/types/base';
import { Client } from 'yorkie-js-sdk';

export interface PeersState {
  peers: {
    [id: string]: Peer;
  };
}

const peersSlice = createSlice({
  name: 'peers',
  initialState: { peers: {} } as PeersState,
  reducers: {
    updatePeers(
      state,
      action: PayloadAction<{
        client: Client;
        peers: { [id: string]: Peer };
      }>,
    ) {
      for (const id of Object.keys(state.peers)) {
        state.peers[id] = { ...state.peers[id], ...action.payload.peers[id] };
      }
    },
    registerPeer(
      state,
      action: PayloadAction<{
        myClientID: string;
        peerMeta: any;
        peerStatus: string;
      }>,
    ) {
      const { myClientID, peerMeta, peerStatus } = action.payload;
      const { peers } = state;
      if (!peers[myClientID]) {
        peers[myClientID] = {} as Peer;
      }
      const peer = {
        id: myClientID,
        color: peerMeta.color,
        image: peerMeta.image,
        username: peerMeta.username,
        status: peerStatus === 'activated' ? ConnectionStatus.Connected : ConnectionStatus.Disconnected,
      };
      peers[myClientID] = { ...peers[myClientID], ...peer };
    },
    syncPeer(
      state,
      action: PayloadAction<{
        myClientID: string;
        changedPeers: { [id: string]: Peer };
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
    syncSelectedNetwork(
      state,
      action: PayloadAction<{
        myClientID: string;
        networkID: string;
      }>,
    ) {
      const { peers } = state;
      const { myClientID, networkID } = action.payload;
      peers[myClientID].selectedNetworkID = networkID;
    },
    syncCursor(
      state,
      action: PayloadAction<{
        myClientID: string;
        x: number;
        y: number;
      }>,
    ) {
      const { peers } = state;
      const { myClientID, x, y } = action.payload;
      peers[myClientID].cursor = {
        x,
        y,
      };
    },
  },
});

export const { registerPeer, syncPeer, syncSelectedNetwork, syncCursor, updatePeers } = peersSlice.actions;
export default peersSlice.reducer;
