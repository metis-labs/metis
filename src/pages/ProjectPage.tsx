import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import yorkie from 'yorkie-js-sdk';

import NavBar from 'components/NavBar';
import SideBar from 'components/SideBar';
import FileTreeBar from 'components/FileTreeBar';
import DiagramView from 'components/DiagramView';
import CodeView from 'components/CodeView';
import StatusBar from 'components/StatusBar';
import PropertyBar from 'components/PropertyBar';
import { useAppState } from 'index';
import testProject from 'store/testProject';

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
    (async () => {
      const client = yorkie.createClient(`${process.env.REACT_APP_YORKIE_RPC_ADDR}`);
      await client.activate();
      const doc = yorkie.createDocument('projects', projectID);
      await client.attach(doc);
      doc.update((root) => {
        if (!root.project) {
          root.project = testProject;
        }
      });

      const modelIDs = Object.keys(doc.getRootObject().project.models);
      updateAppState((appState) => {
        appState.remote = doc;
        appState.local.selectedModelID = modelIDs[0];
        for (const modelID of modelIDs) {
          appState.local.diagramInfos[modelID] = {
            offset: { x: 0, y: 0 },
            zoom: 0,
          };
        }
        return appState;
      });

      doc.subscribe((a) => {
        updateAppState((appState) => {
          appState.remote = doc;
          appState.repaintCounter += 1;
          return appState;
        });
      });
    })();
  }, [updateAppState, projectID]);

  if (!appState.remote?.getRootObject().project) {
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
