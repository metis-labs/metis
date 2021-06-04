import { combineReducers } from 'redux';

import docReducer from 'features/docSlice';
import peerReducer from 'features/peersSlice';
import localInfoReducer from 'features/localSlice';
import projectInfosReducer from 'features/projectInfosSlice';

const rootReducer = combineReducers({
  docState: docReducer,
  peerState: peerReducer,
  localInfoState: localInfoReducer,
  projectInfosState: projectInfosReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
