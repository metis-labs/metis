import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AddIcon from '@material-ui/icons/Add';

import { AppState } from 'app/rootReducer';
import { addBlock } from 'features/docSlice';
import { BlockType } from 'store/types/blocks';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'absolute',
      background: 'white',
      borderRadius: 10,
      boxShadow: '0 1px 5px 0 #888',
      width: 56,
      top: 140,
      left: 10,
      zIndex: 1,
    },
    button: {
      border: '1px solid gray',
      borderRadius: '3px',
    },
  }),
);

export default function SideBar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const client = useSelector((state: AppState) => state.docState.client);
  const peers = useSelector((state: AppState) => state.peerState.peers);
  const selectedNetworkID = peers[client.getID()].selectedNetworkID;
  const diagramInfos = useSelector((state: AppState) => state.localInfoState.diagramInfos);
  const handleAddBlockClick = useCallback(
    (type: BlockType) => {
      const diagramOffset = diagramInfos[selectedNetworkID].offset;
      dispatch(addBlock({ networkID: selectedNetworkID, type, diagramOffset }));
    },
    [selectedNetworkID, diagramInfos],
  );

  return (
    <div className={classes.root}>
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
  );
}
