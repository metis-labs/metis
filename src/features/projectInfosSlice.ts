import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import api from 'api';
import { fromProjects } from 'api/converter';

export type ProjectInfo = {
  id: string;
  name: string;
  createdAt: Date;
};

type ProjectInfosState = {
  projectInfos: { [projectID: string]: ProjectInfo };
  errorMessage: string;
};

export const createProjectInfos = createAsyncThunk<CreateProjectInfosResult, undefined, { rejectValue: string }>(
  'projectInfos/create',
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

const projectInfosSlice = createSlice({
  name: 'projectInfos',
  initialState: {
    projectInfos: {},
    errorMessage: '',
  } as ProjectInfosState,
  reducers: {
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
  },
  extraReducers: (builder) => {
    builder.addCase(createProjectInfos.fulfilled, (state, { payload }) => {
      state.projectInfos = payload.projectInfos;
    });
    builder.addCase(createProjectInfos.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
  },
});

export const { renameProject, deleteProject } = projectInfosSlice.actions;
export default projectInfosSlice.reducer;

type CreateProjectInfosResult = { projectInfos: { [projectID: string]: ProjectInfo } };
