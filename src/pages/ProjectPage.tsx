import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import yorkie, { Client, Document } from 'yorkie-js-sdk';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import NavBar from 'components/NavBar';
import SideBar from 'components/SideBar';
import FileTreeBar from 'components/FileTreeBar';
import DiagramView from 'components/DiagramView';
import CodeView from 'components/CodeView';
import StatusBar from 'components/StatusBar';
import PropertyBar from 'components/PropertyBar';
import initialProject from 'store/initialProject';
import templateProjects from 'store/templates';
import { useAppState } from 'App';

import { decodeEventDesc } from 'store/types/events';

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
  const [appState, updateAppState] = useAppState();
  const [viewMode, setViewMode] = useState('diagram');

  useEffect(() => {
    let doc: Document;
    const unsubscribes: Array<Function> = [];
    (async () => {
      if (!appState.client) {
        return;
      }
      const client = appState.client as Client;

      doc = yorkie.createDocument('projects', projectID);
      await client.attach(doc);

      doc.update((root) => {
        const params = new URLSearchParams(search);
        const templateID = params.get('template_id');
        if (!root.project) {
          if (templateID) {
            root.project = templateProjects[templateID];
          } else {
            root.project = initialProject;
          }
        }
        if (!root.peers) {
          root.peers = {};
        }
        const networkIDs = Object.keys(root.project.networks);
        if (!root.peers[client.getID()]) {
          root.peers[client.getID()] = {
            selectedNetworkID: networkIDs[0],
          };
        }
      });

      const networkIDs = Object.keys(doc.getRoot().project.networks);
      // TODO(youngteac.hong): Until Yorkie supports metadata-update, we use remote temporarily.
      // client.updateMetadata('selectedNetworkID', networkIDs[0]);
      updateAppState((appState) => {
        appState.remote = doc;
        appState.local.selectedNetworkID = networkIDs[0];
        for (const networkID of networkIDs) {
          appState.local.diagramInfos[networkID] = {
            offset: { x: 0, y: 0 },
            zoom: 100,
          };
        }
        return appState;
      });

      function handleEvent(event) {
        let isPeersChanged = false;
        let isProjectChanged = false;
        if (event.type === 'local-change' || event.type === 'remote-change') {
          for (const changeInfo of event.value) {
            for (const path of changeInfo.paths) {
              if (path.startsWith('$.project')) {
                isProjectChanged = true;
              } else if (path.startsWith('$.peers')) {
                isPeersChanged = true;
              }
              if (isProjectChanged && isPeersChanged) {
                return [isProjectChanged, isPeersChanged];
              }
            }
            if (changeInfo.change.getMessage()) {
              const desc = decodeEventDesc(changeInfo.change.getMessage());
              if (desc.actionType === 'create' && desc.entityType === 'network') {
                updateAppState((appState) => {
                  appState.local.diagramInfos[desc.id] = {
                    offset: { x: 0, y: 0 },
                    zoom: 100,
                  };

                  if (event.type === 'local-change') {
                    appState.local.selectedNetworkID = desc.id;
                  }
                  return appState;
                });
              } else if (desc.actionType === 'delete' && desc.entityType === 'network') {
                updateAppState((appState) => {
                  delete appState.local.diagramInfos[desc.id];
                  if (desc.id === appState.local.selectedNetworkID) {
                    appState.local.selectedNetworkID = null;
                  }
                  return appState;
                });
              }
            }
          }
        }
        return [isProjectChanged, isPeersChanged];
      }

      // Trigger repaint using change events
      unsubscribes.push(
        doc.subscribe((event) => {
          const [isProjectChanged, isPeersChanged] = handleEvent(event);

          updateAppState((appState) => {
            if (isProjectChanged) {
              appState.remoteRepaintCounter += 1;
            }
            if (isPeersChanged) {
              appState.peersRepaintCounter += 1;
            }
            return appState;
          });
        }),
      );
    })();

    return async () => {
      for (const unsubscribe of unsubscribes) {
        unsubscribe();
      }
      if (appState.client && doc) {
        await appState.client.detach(doc);
      }
      updateAppState((appState) => {
        appState.remote = null;
        return appState;
      });
    };
  }, [appState.client, updateAppState, projectID, search]);

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
      {appState.local.selectedNetworkID ? (
        <>
          <main className={classes.content}>
            {viewMode === 'diagram' ? <DiagramView /> : <CodeView />}
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
