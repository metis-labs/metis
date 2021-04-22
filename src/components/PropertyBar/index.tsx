import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';

import { Project, BlockType, IOBlock, NetworkBlock, NormalBlock, isNormalBlockType } from 'store/types';
import { useAppState } from 'App';

import IOProperties from './IOProperties';
import NetworkProperties from './NetworkProperties';
import NormalProperties from './NormalProperties';

const drawerWidth = 240;

const useStyles = makeStyles(() =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
  }),
);

export default function PropertyBar() {
  const classes = useStyles();
  const [appState] = useAppState();
  const project = appState.remote.getRoot().project as Project;
  const { selectedNetworkID } = appState.local;
  const { selectedBlockID } = appState.local.diagramInfos[selectedNetworkID];
  const network = project.networks[selectedNetworkID];

  if (!selectedBlockID || !network.blocks[selectedBlockID]) {
    return null;
  }

  const selectedBlock = network.blocks[selectedBlockID];

  return (
    <Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }} anchor="right">
      <Toolbar />
      <Divider />
      {selectedBlock.type === BlockType.Network && <NetworkProperties block={selectedBlock as NetworkBlock} />}
      {(selectedBlock.type === BlockType.In || selectedBlock.type === BlockType.Out) && <IOProperties block={selectedBlock as IOBlock} />}
      {isNormalBlockType(selectedBlock.type) && <NormalProperties block={selectedBlock as NormalBlock} />}
    </Drawer>
  );
}
