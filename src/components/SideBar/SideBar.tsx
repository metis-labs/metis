import React, { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useProject } from '../../index';
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
  }),
);

export default function SideBar() {
  const classes = useStyles();
  const [, updateProject] = useProject();
  const handleAddBlockClick = useCallback((type: BlockType) => {
    updateProject((project) => {
      const fragment = project.fragments[project.selectedFragmentId];
      const blockLength = Object.keys(fragment.blocks).length;
      const position = { x: 100 + 10 * blockLength, y: 100 + 10 * blockLength };
      const id = uuidv4();
      switch(type) {
        case BlockType.In:
          fragment.blocks[id] = {
            id,
            name: `test_in_${blockLength + 1}`,
            type: BlockType.In,
            position,
            parameters: {},
          };
          break;
        case BlockType.Out:
          fragment.blocks[id] = {
            id,
            name: `test_out_${blockLength + 1}`,
            type: BlockType.Out,
            position,
            parameters: {},
          };
          break;
        default:
          fragment.blocks[id] = {
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

      return project;
    });
  }, [updateProject]);

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
              <ArrowDownwardIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem button onClick={() => handleAddBlockClick(BlockType.Out)}>
            <ListItemIcon>
              <ArrowUpwardIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem button onClick={() => handleAddBlockClick(BlockType.Conv2d)}>
            <ListItemIcon>
              <AddBoxIcon />
            </ListItemIcon>
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}
