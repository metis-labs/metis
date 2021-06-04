import React, { ChangeEvent, useCallback } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { Project } from 'store/types';
import { BlockType, NetworkBlock } from 'store/types/blocks';

import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';
import { changePrameter, changeProperty, changeRefNetwork } from 'features/docSlice';
import { preserveCaret, stopPropagationOnKeydown } from './utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    section: {
      margin: theme.spacing(1, 1),
    },
    // necessary for content to be below app bar
    formControl: {
      margin: theme.spacing(1),
      width: 200,
    },
    formSelect: {
      marginTop: 16,
    },
  }),
);

export default function NetworkProperties(props: { block: NetworkBlock }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const doc = useSelector((state: AppState) => state.docState.doc);
  const repaintCounter = useSelector((state: AppState) => state.docState.repaintingCounter);
  const diagramInfos = useSelector((state: AppState) => state.localInfoState.diagramInfos);
  const client = useSelector((state: AppState) => state.docState.client);
  const peers = useSelector((state: AppState) => state.peerState.peers);
  const selectedNetworkID = peers[client.getID()].selectedNetworkID;
  const project = doc.getRoot().project as Project;
  const { selectedBlockID } = diagramInfos[selectedNetworkID];
  const { block: selectedBlock } = props;

  const otherNetworks = Object.values(project.networks).filter((network: any) => network.id !== selectedNetworkID);

  const onRefNetworkChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      dispatch(changeRefNetwork({ doc, event, selectedNetworkID, selectedBlockID }));
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

  const handleParameterChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
      preserveCaret(event);
      dispatch(changePrameter({ doc, event, selectedNetworkID, selectedBlockID, key }));
    },
    [doc, selectedBlockID, selectedNetworkID, repaintCounter],
  );

  const paramNames = Object.keys(selectedBlock.parameters);
  const refNetwork = selectedBlock.type === BlockType.Network ? project.networks[selectedBlock.refNetwork] : '';

  return (
    <>
      <FormControl className={classes.formControl}>
        <InputLabel id="ref-network-select-label">Reference Network</InputLabel>
        <Select
          labelId="ref-network-select-label"
          id="ref-network-select"
          className={classes.formSelect}
          value={refNetwork ? refNetwork.name : ''}
          onChange={onRefNetworkChange}
        >
          <MenuItem key="none" value="">
            <em>None</em>
          </MenuItem>
          {otherNetworks.map((network) => (
            <MenuItem key={network.id} value={network.name}>
              {network.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <TextField
          label="Repeats"
          value={selectedBlock.repeats}
          onChange={(event) => handlePropertyChange(event, 'repeats')}
          onKeyDown={stopPropagationOnKeydown}
        />
      </FormControl>
      <div className={classes.section}>
        <Typography variant="h6">Parameters</Typography>
        {paramNames.map((paramName) => (
          <FormControl className={classes.formControl}>
            <TextField
              key={paramName}
              label={paramName}
              value={selectedBlock.parameters[paramName] || ''}
              onChange={(event) => handleParameterChange(event, paramName)}
              onKeyDown={stopPropagationOnKeydown}
            />
          </FormControl>
        ))}
      </div>
    </>
  );
}
