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
          state.peers[clientID] = peer;
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
      const { myClientID, networkID } = action.payload;
      const { peers } = state;
      peers[myClientID].selectedNetworkID = networkID;
    },
  },
});

export const { syncPeer } = peerInfoSlice.actions;
export const { syncSelectedNetwork } = peerInfoSlice.actions;
export default peerInfoSlice.reducer;
