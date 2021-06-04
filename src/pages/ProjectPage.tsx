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
import { attachDoc, attachDocLoading, createDocument, detachDocument, setRepaintCounter } from 'features/docSlice';
import { AppState } from 'app/rootReducer';
import { deleteNetwork, initDiagramInfos } from 'features/localSlice';
import { syncCursor, syncSelectedNetwork } from 'features/peersSlice';

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
  const doc = useSelector((state: AppState) => state.docState.doc);
  const client = useSelector((state: AppState) => state.docState.client);
  const peers = useSelector((state: AppState) => state.peerState.peers);
  const selectedNetworkID = peers[client.getID()].selectedNetworkID;

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
      const networkID = doc.getRoot().peers[client.getID()].selectedNetworkID;
      dispatch(syncSelectedNetwork({ myClientID: client.getID(), networkID }));

      function handleEvent(event) {
        if (event.type === 'local-change' || event.type === 'remote-change') {
          for (const changeInfo of event.value) {
            if (changeInfo.paths[0].startsWith('$.project') || changeInfo.paths[0].startsWith('$.peers')) {
              dispatch(setRepaintCounter(1));
            }
            if (changeInfo.change.getMessage()) {
              const desc = decodeEventDesc(changeInfo.change.getMessage());
              if (desc.actionType === 'create' && desc.entityType === 'network') {
                dispatch(initDiagramInfos({ networkIDs: [desc.id] }));
              } else if (desc.actionType === 'delete' && desc.entityType === 'network') {
                dispatch(deleteNetwork({ networkID: desc.id }));
              }
            }
            if (changeInfo.change.getOperations()[0].key === 'selectedNetworkID') {
              const clientID = changeInfo.change.getID().actor;
              if (clientID !== client.getID()) {
                dispatch(
                  syncSelectedNetwork({
                    myClientID: clientID,
                    networkID: changeInfo.change.getOperations()[1].value.value,
                  }),
                );
              }
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
      {selectedNetworkID ? (
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
