import React, { useCallback } from 'react';

import IconButton from '@material-ui/core/IconButton';
import CodeIcon from '@material-ui/icons/Code';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { useAppState } from 'App';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'absolute',
      top: '64px',
      left: 0,
      width: '100%',
      height: '60px',
      padding: '10px',
      display: 'flex',
      pointerEvents: 'none',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    button: {
      pointerEvents: 'auto',
    },
  }),
);

export default function StatusBar(props: { viewMode: string; setViewMode: Function }) {
  const { viewMode, setViewMode } = props;
  const classes = useStyles();
  const [appState] = useAppState();
  const { project } = appState.remote.getRoot();
  const { selectedModelID } = appState.local;

  const handleClick = useCallback(() => {
    setViewMode(viewMode === 'diagram' ? 'code' : 'diagram');
  }, [viewMode, setViewMode]);

  return (
    <div className={classes.root}>
      <Typography variant="h5">{project.models[selectedModelID].name}</Typography>
      <IconButton className={classes.button} onClick={handleClick}>
        {viewMode === 'diagram' ? <CodeIcon /> : <AccountTreeIcon />}
      </IconButton>
    </div>
  );
}
