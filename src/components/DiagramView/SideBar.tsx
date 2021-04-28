import React, { useCallback } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AddIcon from '@material-ui/icons/Add';

import { useAppState } from 'App';
import { Block, BlockType, createBlock } from 'store/types/blocks';

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
      zIndex: 1
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
        const block = createBlock(type, position, blockLength);
        network.blocks[block.id] = block;
      });
    },
    [appState.remote, selectedNetworkID, appState.local.diagramInfos],
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
