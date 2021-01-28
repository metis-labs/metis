import produce, { Draft } from 'immer';
import { createContext, Dispatch, ReducerAction, useContext, useReducer } from 'react';
import { NetworkFragment } from './types';

type NetworkFragmentReducer = (
  state: NetworkFragment,
  producer: (draft: Draft<NetworkFragment>) => NetworkFragment,
) => NetworkFragment;

export function createStore(initialState: NetworkFragment) {
  const StateContext = createContext<NetworkFragment>(initialState);
  const UpdateContext = createContext(null);

  const reducer: NetworkFragmentReducer = (state, producer) => {
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

  function useFragment(): [NetworkFragment, Dispatch<ReducerAction<NetworkFragmentReducer>>] {
    return [useContext(StateContext), useContext(UpdateContext)];
  }

  return { Provider: StoreProvider, useFragment };
}
