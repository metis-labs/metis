import { combineReducers } from 'redux';

import docReducer from 'features/docSlices';
import peerReducer from 'features/peerInfoSlices';
import localInfoReducer from 'features/localSlices';

const rootReducer = combineReducers({
  docState: docReducer,
  peerState: peerReducer,
  localInfoState: localInfoReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
