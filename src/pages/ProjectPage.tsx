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
import { initialProject } from 'store/initialProject';
import { templateProjects } from 'store/templateProjects';
import { useAppState } from 'index';

import { decodeEventDesc } from 'store/types';

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
      unsubscribes.push(
        client.subscribe((event) => {
          if (event.type === 'peers-changed') {
            const documentKey = doc.getKey().toIDString();
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

      doc.update((root) => {
        const params = new URLSearchParams(props.location.search);
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
        const modelIDs = Object.keys(root.project.models);
        if (!root.peers[client.getID()]) {
          root.peers[client.getID()] = {
            selectedModelID: modelIDs[0],
          };
        }
      });

      const modelIDs = Object.keys(doc.getRoot().project.models);
      // TODO(youngteac.hong): Until Yorkie supports metadata-update, we use remote temporarily.
      // client.updateMetadata('selectedModelID', modelIDs[0]);
      updateAppState((appState) => {
        appState.remote = doc;
        appState.local.myClientID = client.getID();
        appState.local.selectedModelID = modelIDs[0];
        for (const modelID of modelIDs) {
          appState.local.diagramInfos[modelID] = {
            offset: { x: 0, y: 0 },
            zoom: 100,
          };
        }
        return appState;
      });

      // Trigger repaint using change events
      unsubscribes.push(
        doc.subscribe((event) => {
          const [isProjectChanged, isPeersChanged] = (() => {
            if (event.type === 'local-change' || event.type === 'remote-change') {
              let isPeersChanged = false;
              let isProjectChanged = false;
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
                  if (desc.actionType === 'create' && desc.entityType === 'model') {
                    updateAppState((appState) => {
                      appState.local.diagramInfos[desc.id] = {
                        offset: { x: 0, y: 0 },
                        zoom: 100,
                      };
                      return appState;
                    });
                  } else if (desc.actionType === 'delete' && desc.entityType === 'model') {
                    updateAppState((appState) => {
                      delete appState.local.diagramInfos[desc.id];
                      if (desc.id === appState.local.selectedModelID) {
                        appState.local.selectedModelID = null;
                      }
                      return appState;
                    });
                  }
                }
              }
              return [isProjectChanged, isPeersChanged];
            }
          })();

          updateAppState((appState) => {
            if (isProjectChanged) {
              appState.repaintCounter += 1;
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
      if (client) {
        await client.deactivate();
      }
    };
  }, [updateAppState, projectID, props.location.search]);

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
        {appState.local.selectedModelID ? (
          <>
            {viewMode === 'diagram' ? <DiagramView /> : <CodeView />}
            <StatusBar viewMode={viewMode} setViewMode={setViewMode} />
          </>
        ) : null}
      </main>
      {appState.local.selectedModelID && <PropertyBar />}
    </div>
  );
}
