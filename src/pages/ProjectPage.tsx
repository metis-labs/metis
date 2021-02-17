import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import NavBar from 'components/NavBar';
import SideBar from 'components/SideBar';
import FileTreeBar from 'components/FileTreeBar';
import DiagramView from 'components/DiagramView';
import CodeView from 'components/CodeView';
import StatusBar from 'components/StatusBar';
import PropertyBar from 'components/PropertyBar';

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

export default function ProjectPage() {
  const classes = useStyles();
  const [viewMode, setViewMode] = useState('diagram');
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
