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

import { useAppState } from '../../index';
import { BlockType } from '../../store/types';

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
  const [appState,] = useAppState();
  const selectedModelID = appState.local.selectedModelID;
  const handleAddBlockClick = useCallback(
    (type: BlockType) => {
      appState.remote.update((root) => {
        const model = root.project.models[selectedModelID];
        const blockLength = Object.keys(model.blocks).length;
        const position = { x: 100 + 10 * blockLength, y: 100 + 10 * blockLength };
        const id = uuidv4();
        switch (type) {
          case BlockType.In:
            model.blocks[id] = {
              id,
              name: `test_in_${blockLength + 1}`,
              type: BlockType.In,
              position,
            };
            break;
          case BlockType.Out:
            model.blocks[id] = {
              id,
              name: `test_out_${blockLength + 1}`,
              type: BlockType.Out,
              position,
            };
            break;
          default:
            model.blocks[id] = {
              id,
              name: `test_${blockLength + 1}`,
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
    [appState.remote, selectedModelID],
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
