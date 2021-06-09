import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from 'store/types';

export interface ProjectState {
  project: Project;
}

const projectSlice = createSlice({
  name: 'project',
  initialState: { project: {} } as ProjectState,
  reducers: {
    updateProject(
      state,
      action: PayloadAction<{
        project: Project;
      }>,
    ) {
      const modifiedProject = action.payload.project;
      state.project = { ...modifiedProject };
    },
  },
});

export const { updateProject } = projectSlice.actions;
export default projectSlice.reducer;
