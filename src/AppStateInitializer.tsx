import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from 'app/rootReducer';
import { activateClient, deactivateClient, DocStatus, setStatus } from 'features/docSlice';
import { patchPeers } from 'features/peersSlice';

function AppStateInitializer() {
  const dispatch = useDispatch();
  const client = useSelector((state: AppState) => state.docState.client);
  const doc = useSelector((state: AppState) => state.docState.doc);
  const status = useSelector((state: AppState) => state.docState.status);

  useEffect(() => {
    dispatch(activateClient());
    return () => {
      dispatch(deactivateClient({ client }));
    };
  }, []);

  useEffect(() => {
    if (!client || !doc) {
      return () => {};
    }
    const unsubscribe = client.subscribe((event) => {
      if (event.type === 'peers-changed') {
        const documentKey = doc.getKey();
        const changedPeers = event.value[documentKey] as any;
        dispatch(
          patchPeers({
            myClientID: client.getID(),
            changedPeers,
          }),
        );
      }
      if (
        status === DocStatus.Detached &&
        ((event.type === 'status-changed' && event.value === 'deactivated') ||
          (event.type === 'stream-connection-status-changed' && event.value === 'disconnected') ||
          (event.type === 'document-synced' && event.value === 'sync-failed'))
      ) {
        dispatch(setStatus(DocStatus.Attached));
      } else if (
        status === DocStatus.Attached &&
        (event.type === 'peers-changed' ||
          event.type === 'documents-changed' ||
          (event.type === 'status-changed' && event.value === 'activated') ||
          (event.type === 'stream-connection-status-changed' && event.value === 'connected') ||
          (event.type === 'document-synced' && event.value === 'synced'))
      ) {
        dispatch(setStatus(DocStatus.Detached));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [doc, client]);

  return <></>;
}

export default AppStateInitializer;
