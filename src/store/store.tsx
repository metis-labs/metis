import produce, { Draft } from 'immer';
import { createContext, Dispatch, ReducerAction, useContext, useReducer } from 'react';
import { Project } from './types';

type ProjectReducer = (state: Project, producer: (draft: Draft<Project>) => Project) => Project;

export function createStore(initialState: Project) {
  const StateContext = createContext<Project>(initialState);
  const UpdateContext = createContext(null);

  const reducer: ProjectReducer = (state, producer) => {
    return produce(state, producer);
  };

  function StoreProvider({ children }) {
    const [state, updater] = useReducer(reducer, initialState);
    return (
      <UpdateContext.Provider value={updater}>
        <StateContext.Provider value={state}>{children}</StateContext.Provider>
      </UpdateContext.Provider>
    );
  }

  function useProject(): [Project, Dispatch<ReducerAction<ProjectReducer>>] {
    return [useContext(StateContext), useContext(UpdateContext)];
  }

  return { Provider: StoreProvider, useProject };
}
