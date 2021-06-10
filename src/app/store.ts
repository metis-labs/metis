import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { fromProjects } from 'api/converter';
import rootReducer from 'app/rootReducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    thunk: {
      extraArgument: fromProjects,
    },
    serializableCheck: false,
    imutableCheck: true,
  }),
});

export default store;
