import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from 'store/types';
import { Network } from 'store/types/networks';

export interface ProjectState {
  project: Project;
}

const projectSlice = createSlice({
  name: 'project',
  initialState: {} as Project,
  reducers: {
    updateProject(
      state,
      action: PayloadAction<{
        project: Project;
      }>,
    ) {
      const modifiedProject = action.payload.project;

      state.id = modifiedProject.id;
      state.name = modifiedProject.name;
      if (!state.networks) {
        state.networks = {};
      }
      for (const id of Object.keys(modifiedProject.networks)) {
        if (!state?.networks[id]) {
          state.networks[id] = {} as Network;
        }
        state.networks[id] = {
          ...state.networks[id],
          ...modifiedProject.networks[id],
        };
      }
    },
  },
});

export const { updateProject } = projectSlice.actions;
export default projectSlice.reducer;
