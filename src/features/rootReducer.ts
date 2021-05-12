import { combineReducers } from 'redux';

import peerReducer from 'features/peerInfoSlices';

const rootReducer = combineReducers({
  peerState: peerReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
