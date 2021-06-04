import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PeerInfo } from 'store/types';
import { ConnectionStatus } from 'store/types/base';

export interface PeerInfoState {
  peers: {
    [id: string]: PeerInfo;
  };
}

const initialPeerInfoState: PeerInfoState = {
  peers: {},
};

const peerInfoSlice = createSlice({
  name: 'peerInfo',
  initialState: initialPeerInfoState,
  reducers: {
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
        peers[myClientID] = {} as PeerInfo;
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
        changedPeers: { [id: string]: PeerInfo };
      }>,
    ) {
      const { myClientID, changedPeers } = action.payload;
      const { peers } = state;

      for (const clientID of Object.keys(peers)) {
        if (!changedPeers[clientID]) {
          peers[clientID].status = ConnectionStatus.Disconnected;
        }
      }

      for (const [clientID, peerInfoData] of Object.entries(changedPeers || {})) {
        if (!peers[clientID] || peers[clientID].status === ConnectionStatus.Disconnected) {
          const peerInfo = peerInfoData;
          const peer = {
            id: clientID,
            status: ConnectionStatus.Connected,
            color: peerInfo.color,
            image: peerInfo.image,
            username: peerInfo.username,
            selectedNetworkID: peerInfo.selectedNetworkID,
            cursor: peerInfo.cursor,
            isMine: myClientID === clientID,
          };
          peers[clientID] = peer;
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

export const { registerPeer, syncPeer, syncSelectedNetwork, syncCursor } = peerInfoSlice.actions;
export default peerInfoSlice.reducer;
