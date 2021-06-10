import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Network } from 'store/types/networks';

export type Project = {
  id: string;
  name: string;
  networks: { [networkID: string]: Network };
};

type ProjectState = {
  project: Project;
};

const projectSlice = createSlice({
  name: 'project',
  initialState: { project: {} } as ProjectState,
  reducers: {
    updateProject(state, action: PayloadAction<Project>) {
      const modifiedProject = action.payload;
      state.project = modifiedProject;
    },
  },
});

export const { updateProject } = projectSlice.actions;
export default projectSlice.reducer;
