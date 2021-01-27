import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useFragment } from '../../index';
import { BlockType } from '../../store/store';

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
  const [, updateFragment] = useFragment();
  const handleClick = () => {
    updateFragment((fragment) => {
      const length = Object.keys(fragment.blocks).length;
      const id = `${length + 1}`;
      fragment.blocks[id] = {
        id,
        name: `test_${length + 1}`,
        type: BlockType.Conv2d,
        position: { x: 100 + 10 * length, y: 100 + 10 * length },
      };
    });
  };

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
          <ListItem button>
            <ListItemIcon>
              <ArrowDownwardIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ArrowUpwardIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem button onClick={handleClick}>
            <ListItemIcon>
              <AddBoxIcon />
            </ListItemIcon>
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}
