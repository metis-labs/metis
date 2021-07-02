// Metis
// Copyright 2021-present NAVER Corp.
// Apache License v2.0

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { BlockIDArgs } from './docSlice';
import { Position } from './peersSlice';

export type DiagramInfo = {
  offset: Position;
  zoom: number;
  selectedBlockID?: string;
};

type LocalInfoState = {
  diagramInfos: { [networkID: string]: DiagramInfo };
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
    initDiagramInfos(state, action: PayloadAction<string[]>) {
      const networkIDs = action.payload;
      for (const networkID of networkIDs) {
        state.diagramInfos[networkID] = {
          offset: { x: 0, y: 0 },
          zoom: 100,
        };
      }
    },
    deleteNetwork(state, action: PayloadAction<string>) {
      const networkID = action.payload;
      delete state.diagramInfos[networkID];
    },
    selectBlock(state, action: PayloadAction<SelectBlockArgs>) {
      const { selectedNetworkID, selectedBlockID } = action.payload;
      state.diagramInfos[selectedNetworkID].selectedBlockID = selectedBlockID;
    },
    updateOffset(
      state,
      action: PayloadAction<{
        selectedNetworkID: string;
        offset: Position;
      }>,
    ) {
      const { selectedNetworkID, offset } = action.payload;
      state.diagramInfos[selectedNetworkID].offset = {
        x: offset.x,
        y: offset.y,
      };
    },
    updateZoom(
      state,
      action: PayloadAction<{
        selectedNetworkID: string;
        zoom: number;
      }>,
    ) {
      const { selectedNetworkID, zoom } = action.payload;
      state.diagramInfos[selectedNetworkID].zoom = zoom;
    },
  },
});

export const { initDiagramInfos, selectBlock, deleteNetwork, updateOffset, updateZoom } = localInfoSlice.actions;
export default localInfoSlice.reducer;

interface SelectBlockArgs extends BlockIDArgs {}
