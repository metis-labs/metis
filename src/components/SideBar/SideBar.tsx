import React, { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AddIcon from '@material-ui/icons/Add';

import { useAppState } from 'App';
import { Block, BlockType } from '../../store/types';

const drawerWidth = 60;

const useStyles = makeStyles(() =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'hidden',
    },
    button: {
      border: '1px solid gray',
      borderRadius: '3px',
    },
  }),
);

export default function SideBar() {
  const classes = useStyles();
  const [appState] = useAppState();
  const { selectedNetworkID } = appState.local;
  const handleAddBlockClick = useCallback(
    (type: BlockType) => {
      appState.remote.update((root) => {
        const network = root.project.networks[selectedNetworkID];
        const blockLength = Object.values(network.blocks).filter((block: Block) => block.type === type).length;
        const diagramOffset = appState.local.diagramInfos[selectedNetworkID].offset;
        const position = { x: 200 + 10 * blockLength - diagramOffset.x, y: 200 + 10 * blockLength - diagramOffset.y };
        const id = uuidv4();
        switch (type) {
          case BlockType.In:
            network.blocks[id] = {
              id,
              name: `in_${blockLength + 1}`,
              type: BlockType.In,
              position,
            };
            break;
          case BlockType.Out:
            network.blocks[id] = {
              id,
              name: `out_${blockLength + 1}`,
              type: BlockType.Out,
              position,
            };
            break;
          default:
            network.blocks[id] = {
              id,
              name: `${BlockType.Conv2d.toLowerCase()}_${blockLength + 1}`,
              type: BlockType.Conv2d,
              position,
              repeats: 1,
              parameters: {
                inChannels: ' ',
                outChannels: ' ',
                kernelSize: ' ',
                stride: 1,
                padding: 0,
                paddingMode: 'zeros', // categorical
                dilation: 1,
                groups: 1,
                bias: false, // boolean
              },
            };
        }
      });
    },
    [appState.remote, selectedNetworkID, appState.local.diagramInfos],
  );

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          <ListItem button onClick={() => handleAddBlockClick(BlockType.In)}>
            <ListItemIcon>
              <KeyboardArrowDownIcon className={classes.button} />
            </ListItemIcon>
          </ListItem>
          <ListItem button onClick={() => handleAddBlockClick(BlockType.Out)}>
            <ListItemIcon>
              <KeyboardArrowUpIcon className={classes.button} />
            </ListItemIcon>
          </ListItem>
          <ListItem button onClick={() => handleAddBlockClick(BlockType.Conv2d)}>
            <ListItemIcon>
              <AddIcon className={classes.button} />
            </ListItemIcon>
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}
