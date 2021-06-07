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
import { attachDoc, attachDocLoading, detachDocument, selectFirstNetwork, setRepaintCounter } from 'features/docSlice';
import { AppState } from 'app/rootReducer';
import { deleteNetwork, initDiagramInfos } from 'features/localSlice';
import { updatePeers } from 'features/peersSlice';

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

  useEffect(() => {
    async function attachDocAsync() {
      if (!client) {
        return;
      }
      dispatch(attachDocLoading(true));
      await dispatch(attachDoc({ client, projectID }));
    }
    attachDocAsync();
    return () => {
      dispatch(attachDocLoading(true));
    };
  }, [projectID, client, search]);

  useEffect(() => {
    if (!doc) {
      return () => {};
    }
    const networkIDs = Object.keys(doc.getRoot().project.networks);
    dispatch(initDiagramInfos({ networkIDs }));
    function handleEvent(event) {
      if (event.type === 'local-change' || event.type === 'remote-change') {
        for (const changeInfo of event.value) {
          if (changeInfo.paths[0].startsWith('$.project')) {
            dispatch(setRepaintCounter(1));
          } else if (changeInfo.paths[0].startsWith('$.peers')) {
            const peers = JSON.parse(doc.toJSON()).peers;
            dispatch(updatePeers({ client, peers }));
          }
          if (changeInfo.change.getMessage()) {
            const desc = decodeEventDesc(changeInfo.change.getMessage());
            if (desc.actionType === 'create' && desc.entityType === 'network') {
              dispatch(initDiagramInfos({ networkIDs: [desc.id] }));
            } else if (desc.actionType === 'delete' && desc.entityType === 'network') {
              dispatch(deleteNetwork({ networkID: desc.id }));
            }
          }
        }
      }
    }
    doc.subscribe((event) => {
      handleEvent(event);
    });
    dispatch(selectFirstNetwork());
    return () => {
      if (doc) {
        dispatch(detachDocument());
      }
    };
  }, [doc]);

  if (!doc?.getRoot().project) {
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    );
  }

  const selectedNetworkID = peers[client.getID()].selectedNetworkID;

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
