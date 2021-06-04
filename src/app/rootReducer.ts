import { combineReducers } from 'redux';

import docReducer from 'features/docSlice';
import peerReducer from 'features/peersSlice';
import localInfoReducer from 'features/localSlice';

const rootReducer = combineReducers({
  docState: docReducer,
  peerState: peerReducer,
  localInfoState: localInfoReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
