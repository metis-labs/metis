import React, {useCallback} from "react";

import IconButton from '@material-ui/core/IconButton';
import CodeIcon from '@material-ui/icons/Code';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: "absolute",
      top: "64px",
      left: 0,
      width: "100%",
      height: "30px",
    },
    toggleView: {
      float: 'right'
    }
  }),
);

export default function StatusBar(props: {viewMode: string, setViewMode: Function}) {
  const { viewMode, setViewMode } = props;
  const classes = useStyles();

  const handleClick = useCallback(() => {
    setViewMode(viewMode === 'diagram' ? 'code' : 'diagram');
  }, [viewMode, setViewMode]);

  return (
    <div className={classes.root}>
      <IconButton className={classes.toggleView} onClick={handleClick}>
        {viewMode === 'diagram' ? <CodeIcon /> : <AccountTreeIcon />}
      </IconButton>
    </div>
  );
}
