// Metis
// Copyright 2021-present NAVER Corp.
// Apache License v2.0

import React, { ChangeEvent, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

import { AppState } from 'app/rootReducer';
import { updateBlockType, updateProperty } from 'features/docSlice';
import {
  BlockType,
  IOBlock,
  NetworkBlock,
  NormalBlock,
  isIOBlockType,
  isNetworkBlockType,
  isNormalBlockType,
} from 'store/types/blocks';
import NormalProperties from './NormalProperties';
import IOProperties from './IOProperties';
import NetworkProperties from './NetworkProperties';
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
  const client = useSelector((state: AppState) => state.docState.client);
  const project = useSelector((state: AppState) => state.projectState.project);
  const peers = useSelector((state: AppState) => state.peerState.peers);
  const diagramInfos = useSelector((state: AppState) => state.localInfoState.diagramInfos);
  const { selectedNetworkID } = peers[client.getID()];
  const network = project.networks[selectedNetworkID];
  const { selectedBlockID } = diagramInfos[selectedNetworkID];

  const onTypeChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const blockType = event.target.value as BlockType;

      dispatch(updateBlockType({ selectedNetworkID, selectedBlockID, blockType }));
    },
    [selectedBlockID, selectedNetworkID],
  );

  const handlePropertyChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
      preserveCaret(event);
      const propertyValue = event.target.value;
      dispatch(
        updateProperty({
          selectedNetworkID,
          selectedBlockID,
          key,
          value: propertyValue,
        }),
      );
    },
    [selectedBlockID, selectedNetworkID],
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
