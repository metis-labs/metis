import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import yorkie from 'yorkie-js-sdk';

import NavBar from 'components/NavBar';
import SideBar from 'components/SideBar';
import FileTreeBar from 'components/FileTreeBar';
import DiagramView from 'components/DiagramView';
import CodeView from 'components/CodeView';
import StatusBar from 'components/StatusBar';
import PropertyBar from 'components/PropertyBar';
import { useAppState } from 'index';
import { Project } from 'store/types';
import testProject from 'store/testProject';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
    },
    content: {
      position: 'relative',
      flexGrow: 1,
    },
  }),
);

export default function ProjectPage(props: RouteComponentProps<{projectID: string}>) {
  const classes = useStyles();
  const { match: { params: { projectID } } } = props;
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

      // TODO(youngteac.hong): We need to reflect the status of the remote location.
      updateAppState((appState) => {
        const root = doc.getRootObject();
        appState.selectedProject = JSON.parse(root.project.toJSON()) as Project;
        return appState;
      });
    })();
  }, [updateAppState, projectID]);

  if (!appState.selectedProject) {
    // TODO(youngteac.hong): Display loading progress.
    return <div>loading</div>;
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
