import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from 'api';
import { fromProjects } from 'api/converter';

import { ProjectInfo, DiagramInfo } from 'store/types';
import { Position } from 'store/types/base';

type LocalInfoState = {
  diagramInfos: { [networkID: string]: DiagramInfo };
  projectInfos: { [projectID: string]: ProjectInfo };
  selectedNetworkID?: string;
  errorMessage: string;
};

const initialLocalInfoState: LocalInfoState = {
  diagramInfos: {},
  projectInfos: {},
  errorMessage: '',
};

export const syncProjectInfos = createAsyncThunk<SyncProjectInfosResult, undefined, { rejectValue: string }>(
  'projectInfos/sync',
  async (_: undefined, thunkApi) => {
    try {
      let projectInfos = {};
      await api.listProjects().then((res) => {
        projectInfos = fromProjects(res.getProjectsList());
      });
      return { projectInfos };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  },
);

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
    renameProject(
      state,
      action: PayloadAction<{
        projectID: string;
        projectName: string;
      }>,
    ) {
      const { projectID, projectName } = action.payload;
      state.projectInfos[projectID].name = projectName;
    },
    deleteProject(
      state,
      action: PayloadAction<{
        projectID: string;
      }>,
    ) {
      const { projectID } = action.payload;
      delete state.projectInfos[projectID];
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
  extraReducers: (builder) => {
    builder.addCase(syncProjectInfos.fulfilled, (state, { payload }) => {
      state.projectInfos = payload.projectInfos;
    });
    builder.addCase(syncProjectInfos.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
  },
});

export const {
  initDiagramInfos,
  renameProject,
  deleteProject,
  syncSelfSelectedNetwork,
  syncSelfSelectedBlock,
  deleteNetwork,
  syncOffset,
  syncZoom,
} = localInfoSlice.actions;
export default localInfoSlice.reducer;

type SyncProjectInfosResult = { projectInfos: { [projectID: string]: ProjectInfo } };
