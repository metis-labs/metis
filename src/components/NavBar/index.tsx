// Metis
// Copyright 2021-present NAVER Corp.
// Apache License v2.0

import React from 'react';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import PeerGroup from './PeerGroup';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: 'white',
      zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      '& > a': {
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        textDecoration: 'none',
      },
    },
  }),
);

export default function NavBar() {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <Link to="/">ML DESIGNER</Link>
        </Typography>
        <PeerGroup />
      </Toolbar>
    </AppBar>
  );
}
