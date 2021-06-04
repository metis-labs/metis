import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DiagramInfo } from 'store/types';
import { Position } from 'store/types/base';

type LocalInfoState = {
  diagramInfos: { [networkID: string]: DiagramInfo };
  selectedNetworkID?: string;
  errorMessage: string;
};

const initialLocalInfoState: LocalInfoState = {
  diagramInfos: {},
  errorMessage: '',
};

const localInfoSlice = createSlice({
  name: 'localInfo',
  initialState: initialLocalInfoState,
  reducers: {
    initDiagramInfos(
      state,
      action: PayloadAction<{
        networkIDs: string[];
      }>,
    ) {
      const { networkIDs } = action.payload;
      for (const networkID of networkIDs) {
        state.diagramInfos[networkID] = {
          offset: { x: 0, y: 0 },
          zoom: 100,
        };
      }
    },
    syncSelfSelectedNetwork(
      state,
      action: PayloadAction<{
        networkID: string;
      }>,
    ) {
      const { networkID } = action.payload;
      state.selectedNetworkID = networkID;
    },
    deleteNetwork(
      state,
      action: PayloadAction<{
        networkID: string;
      }>,
    ) {
      const { networkID } = action.payload;
      delete state.diagramInfos[networkID];
      if (networkID === state.selectedNetworkID) {
        delete state.selectedNetworkID;
        state.selectedNetworkID = null;
      }
    },
    syncSelfSelectedBlock(
      state,
      action: PayloadAction<{
        networkID: string;
        blockID: string;
      }>,
    ) {
      const { networkID, blockID } = action.payload;
      state.diagramInfos[networkID].selectedBlockID = blockID;
    },
    syncOffset(
      state,
      action: PayloadAction<{
        networkID: string;
        offset: Position;
      }>,
    ) {
      const { networkID, offset } = action.payload;
      state.diagramInfos[networkID].offset = {
        x: offset.x,
        y: offset.y,
      };
    },
    syncZoom(
      state,
      action: PayloadAction<{
        networkID: string;
        zoom: number;
      }>,
    ) {
      const { networkID, zoom } = action.payload;
      state.diagramInfos[networkID].zoom = zoom;
    },
  },
});

export const { initDiagramInfos, syncSelfSelectedNetwork, syncSelfSelectedBlock, deleteNetwork, syncOffset, syncZoom } =
  localInfoSlice.actions;
export default localInfoSlice.reducer;
