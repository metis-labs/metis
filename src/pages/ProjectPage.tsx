import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import yorkie from 'yorkie-js-sdk';
import anonymous from 'anonymous-animals-gen';
import randomColor from 'randomcolor';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import NavBar from 'components/NavBar';
import SideBar from 'components/SideBar';
import FileTreeBar from 'components/FileTreeBar';
import DiagramView from 'components/DiagramView';
import CodeView from 'components/CodeView';
import StatusBar from 'components/StatusBar';
import PropertyBar from 'components/PropertyBar';
import testProject from 'store/testProject';
import { useAppState } from 'index';

const useStyles = makeStyles((theme: Theme) =>
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
    },
  }),
);

export default function ProjectPage(props: RouteComponentProps<{ projectID: string }>) {
  const classes = useStyles();
  const {
    match: {
      params: { projectID },
    },
  } = props;
  const [appState, updateAppState] = useAppState();
  const [viewMode, setViewMode] = useState('diagram');

  useEffect(() => {
    let client;
    const unsubscribes: Array<Function> = [];
    (async () => {
      const { name, animal } = anonymous.generate();
      client = yorkie.createClient(`${process.env.REACT_APP_YORKIE_RPC_ADDR}`, {
        metadata: {
          username: name,
          image: animal,
          color: randomColor(),
        },
      });

      const doc = yorkie.createDocument('projects', projectID);
      const peersDoc = yorkie.createDocument('peers', projectID);

      unsubscribes.push(
        client.subscribe((event) => {
          if (event.type === 'peers-changed') {
            const documentKey = peersDoc.getKey().toIDString();
            const changedPeers = event.value[documentKey];
            if (!changedPeers) {
              return;
            }

            updateAppState((appState) => {
              appState.peers = changedPeers;
              return appState;
            });
          }
        }),
      );
      await client.activate();
      await client.attach(doc);
      await client.attach(peersDoc);

      doc.update((root) => {
        if (!root.project) {
          root.project = testProject;
        }
      });

      const modelIDs = Object.keys(doc.getRoot().project.models);
      // TODO(youngteac.hong): Until Yorkie supports metadata-update, we use remote temporarily.
      // client.updateMetadata('selectedModelID', modelIDs[0]);
      peersDoc.update((root) => {
        if (!root.peers) {
          root.peers = {};
        }
        if (!root.peers[client.getID()]) {
          root.peers[client.getID()] = {
            selectedModelID: modelIDs[0],
          };
        }
      });

      updateAppState((appState) => {
        appState.remote = doc;
        appState.peersRemote = peersDoc;
        appState.local.myYorkieClientID = client.getID();
        appState.local.selectedModelID = modelIDs[0];
        for (const modelID of modelIDs) {
          appState.local.diagramInfos[modelID] = {
            offset: { x: 0, y: 0 },
            zoom: 100,
          };
        }
        return appState;
      });

      unsubscribes.push(
        doc.subscribe((event) => {
          if (event.type === 'local-change' || event.type === 'remote-change') {
            console.log(event);
            updateAppState((appState) => {
              appState.repaintCounter += 1;
              return appState;
            });
          }
        }),
      );

      unsubscribes.push(
        peersDoc.subscribe((event) => {
          if (event.type === 'local-change' || event.type === 'remote-change') {
            console.log(event);
            updateAppState((appState) => {
              appState.peersRepaintCounter += 1;
              return appState;
            });
          }
        }),
      );
    })();

    return async () => {
      for (const unsubscribe of unsubscribes) {
        unsubscribe();
      }
      if (client) {
        await client.deactivate();
      }
    };
  }, [updateAppState, projectID]);

  if (!appState.remote?.getRoot().project) {
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <NavBar />
      <SideBar />
      <FileTreeBar />
      <main className={classes.content}>
        {viewMode === 'diagram' ? <DiagramView /> : <CodeView />}
        <StatusBar viewMode={viewMode} setViewMode={setViewMode} />
      </main>
      <PropertyBar />
    </div>
  );
}
