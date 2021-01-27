import produce from 'immer';
import { createContext, useContext, useReducer } from 'react';

export enum BlockType {
  In = 'In',
  Out = 'Out',
  Conv2d = 'Conv2d',
  ReLU = 'ReLU',
  MaxPool2d = 'MaxPool2d',
}

export type Position = {
  x: number;
  y: number;
};

export type PropertyValue = string | number | boolean;
export type Properties = { [key: string]: PropertyValue };

export type Block = {
  id: string;
  name: string;
  type: BlockType;
  position: Position;
  properties?: Properties;
};

export type Link = {
  from: string;
  to: string;
};

export type NetworkFragment = {
  blocks: { [id: string]: Block };
  links: Link[];
  selectedBlockID?: string;
};

export function createStore(initialState: NetworkFragment) {
  const StateContext = createContext(initialState);
  const UpdateContext = createContext(null);

  function StoreProvider({ children }) {
    const [state, updater] = useReducer(produce, initialState);
    return (
      <UpdateContext.Provider value={updater}>
        <StateContext.Provider value={state as any}>{children}</StateContext.Provider>
      </UpdateContext.Provider>
    );
  }

  function useFragment() {
    return [useContext(StateContext), useContext(UpdateContext)];
  }

  return { Provider: StoreProvider, useStore: useFragment };
}
