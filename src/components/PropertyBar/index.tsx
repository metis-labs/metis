import React, { ChangeEvent, useCallback } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl/FormControl';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { Project } from 'store/types';
import {
  BlockType,
  IOBlock,
  NetworkBlock,
  NormalBlock,
  isIOBlockType,
  isNetworkBlockType,
  isNormalBlockType,
} from 'store/types/blocks';

import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';
import { changeBlockType, changeProperty } from 'features/docSlices';
import IOProperties from './IOProperties';
import NetworkProperties from './NetworkProperties';
import NormalProperties from './NormalProperties';
import { preserveCaret, stopPropagationOnKeydown } from './utils';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    section: {
      margin: theme.spacing(1, 1),
    },
    formControl: {
      margin: theme.spacing(1),
      width: 200,
    },
    formSelect: {
      marginTop: 16,
    },
  }),
);

export default function PropertyBar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const doc = useSelector((state: AppState) => state.docState.doc);
  const repaintCounter = useSelector((state: AppState) => state.docState.repaintingCounter);
  const diagramInfos = useSelector((state: AppState) => state.localInfoState.diagramInfos);
  const selectedNetworkID = useSelector((state: AppState) => state.localInfoState.selectedNetworkID);
  const project = doc.getRoot().project as Project;
  const network = project.networks[selectedNetworkID];
  const { selectedBlockID } = diagramInfos[selectedNetworkID];

  const onTypeChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      dispatch(changeBlockType({ doc, event, selectedNetworkID, selectedBlockID }));
    },
    [doc, selectedBlockID, selectedNetworkID, repaintCounter],
  );

  const handlePropertyChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
      preserveCaret(event);
      dispatch(changeProperty({ doc, event, selectedNetworkID, selectedBlockID, key }));
    },
    [doc, selectedBlockID, selectedNetworkID, repaintCounter],
  );

  if (!selectedBlockID || !network.blocks[selectedBlockID]) {
    return null;
  }
  const selectedBlock = network.blocks[selectedBlockID];

  return (
    <Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }} anchor="right">
      <Toolbar />
      <Divider />
      <div className={classes.section}>
        <Typography variant="h6">Properties</Typography>
        <FormControl className={classes.formControl}>
          <InputLabel id="type-select-label">Type</InputLabel>
          <Select
            id="type-select"
            labelId="type-select-label"
            value={selectedBlock.type}
            className={classes.formSelect}
            onChange={onTypeChange}
            disabled={isIOBlockType(selectedBlock.type)}
          >
            {Object.keys(BlockType).map((item) => (
              <MenuItem key={item} value={item} disabled={isIOBlockType(item as BlockType)}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            label="Instance name"
            value={selectedBlock.name}
            onChange={(event) => handlePropertyChange(event, 'name')}
            onKeyDown={stopPropagationOnKeydown}
          />
        </FormControl>
        {isNetworkBlockType(selectedBlock.type) && <NetworkProperties block={selectedBlock as NetworkBlock} />}
        {isIOBlockType(selectedBlock.type) && <IOProperties block={selectedBlock as IOBlock} />}
        {isNormalBlockType(selectedBlock.type) && <NormalProperties block={selectedBlock as NormalBlock} />}
      </div>
    </Drawer>
  );
}
