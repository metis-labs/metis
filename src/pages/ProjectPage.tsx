import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import NavBar from 'components/NavBar';
import FileTreeBar from 'components/FileTreeBar';
import DiagramView from 'components/DiagramView';
import CodeView from 'components/CodeView';
import StatusBar from 'components/StatusBar';
import PropertyBar from 'components/PropertyBar';

import { decodeEventDesc } from 'store/types/events';
import { useDispatch, useSelector } from 'react-redux';
import { attachDoc, attachDocLoading, createDocument, detachDocument, setRepaintCounter } from 'features/docSlices';
import { AppState } from 'app/rootReducer';
import { deleteNetwork, initDiagramInfos, syncSelfSelectedNetwork } from 'features/localSlices';
import { syncCursor, syncSelectedNetwork } from 'features/peerInfoSlices';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      position: 'relative',
      flexGrow: 1,
      height: '100vh',
      backgroundColor: '#eaeaeb',
    },
  }),
);

export default function ProjectPage(props: RouteComponentProps<{ projectID: string }>) {
  const classes = useStyles();
  const {
    match: {
      params: { projectID },
    },
    location: { search },
  } = props;
  const [viewMode, setViewMode] = useState('diagram');
  const dispatch = useDispatch();
  const client = useSelector((state: AppState) => state.docState.client);
  const doc = useSelector((state: AppState) => state.docState.doc);
  const localInfoState = useSelector((state: AppState) => state.localInfoState);
  const selectedNetworkID = useSelector((state: AppState) => state.localInfoState.selectedNetworkID);

  useEffect(() => {
    dispatch(createDocument(projectID));

    return () => {
      dispatch(detachDocument());
    };
  }, [projectID]);

  useEffect(() => {
    async function attachDocAsync() {
      if (!client || !doc) {
        return;
      }
      dispatch(attachDocLoading(true));
      await dispatch(attachDoc({ client, doc }));
      const networkIDs = Object.keys(doc.getRoot().project.networks);
      dispatch(initDiagramInfos({ networkIDs }));
      dispatch(syncSelfSelectedNetwork({ networkID: networkIDs[0] }));

      function handleEvent(event) {
        if (event.type === 'local-change' || event.type === 'remote-change') {
          for (const changeInfo of event.value) {
            if (changeInfo.paths[0].startsWith('$.project')) {
              dispatch(setRepaintCounter(1));
            }
            if (changeInfo.change.getMessage()) {
              const desc = decodeEventDesc(changeInfo.change.getMessage());
              if (desc.actionType === 'create' && desc.entityType === 'network') {
                dispatch(initDiagramInfos({ networkIDs: [desc.id] }));
                if (event.type === 'local-change') {
                  dispatch(syncSelfSelectedNetwork({ networkID: desc.id }));
                }
              } else if (desc.actionType === 'delete' && desc.entityType === 'network') {
                dispatch(deleteNetwork({ networkID: desc.id }));
                if (desc.id === selectedNetworkID) {
                  dispatch(syncSelfSelectedNetwork({ networkID: null }));
                }
              }
            }
            if (changeInfo.change.getOperations()[0].key === 'selectedNetworkID') {
              const clientID = changeInfo.change.getID().actor;
              if (clientID === client.getID()) {
                dispatch(syncSelfSelectedNetwork({ networkID: changeInfo.change.getOperations()[0].value.value }));
              } else
                dispatch(
                  syncSelectedNetwork({
                    myClientID: clientID,
                    networkID: changeInfo.change.getOperations()[1].value.value,
                  }),
                );
            } else if (changeInfo.change.getOperations()[0].key === 'cursor') {
              const clientID = changeInfo.change.getID().actor;
              const x = changeInfo.change.getOperations()[1].value.value;
              const y = changeInfo.change.getOperations()[2].value.value;
              dispatch(
                syncCursor({
                  myClientID: clientID,
                  x,
                  y,
                }),
              );
            }
          }
        }
      }
      doc.subscribe((event) => {
        console.log('event type', event.type);
        console.log('event value', event.value);
        handleEvent(event);
      });
    }
    attachDocAsync();
    return () => {
      dispatch(attachDocLoading(true));
    };
  }, [projectID, client, doc, search, initDiagramInfos]);

  if (!doc?.getRoot().project) {
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <NavBar />
      <FileTreeBar />
      {localInfoState.selectedNetworkID ? (
        <>
          <main className={classes.content}>
            {viewMode === 'diagram' ? <DiagramView /> : <CodeView />}
            <DiagramView />
            <StatusBar viewMode={viewMode} setViewMode={setViewMode} />
          </main>
          <PropertyBar />
        </>
      ) : (
        <main className={classes.content} />
      )}
    </div>
  );
}
