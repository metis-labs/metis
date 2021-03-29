import React, { createContext, Dispatch, ReducerAction, useContext, useReducer } from 'react';
import produce, { Draft } from 'immer';

import { AppState } from './types';

type AppStateReducer = (state: AppState, producer: (draft: Draft<AppState>) => AppState) => AppState;

export default function createStore(initialState: AppState) {
  const StateContext = createContext<AppState>(initialState);
  const UpdateContext = createContext(null);

  const reducer: AppStateReducer = (state, producer) => produce(state, producer);

  function StoreProvider({ children }) {
    const [state, updater] = useReducer(reducer, initialState);
    return (
      <UpdateContext.Provider value={updater}>
        <StateContext.Provider value={state}>{children}</StateContext.Provider>
      </UpdateContext.Provider>
    );
  }

  function useAppState(): [AppState, Dispatch<ReducerAction<AppStateReducer>>] {
    return [useContext(StateContext), useContext(UpdateContext)];
  }

  return { Provider: StoreProvider, useAppState };
}
