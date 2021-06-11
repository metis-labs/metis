import React, { ChangeEvent, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { AppState } from 'app/rootReducer';
import { updateParameter, updateProperty, updateRefNetwork } from 'features/docSlice';
import { BlockType, NetworkBlock } from 'store/types/blocks';
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
  const client = useSelector((state: AppState) => state.docState.client);
  const project = useSelector((state: AppState) => state.projectState.project);
  const peers = useSelector((state: AppState) => state.peerState.peers);
  const diagramInfos = useSelector((state: AppState) => state.localInfoState.diagramInfos);
  const { selectedNetworkID } = peers[client.getID()];
  const { selectedBlockID } = diagramInfos[selectedNetworkID];
  const { block: selectedBlock } = props;

  const otherNetworks = Object.values(project.networks).filter((network: any) => network.id !== selectedNetworkID);

  const onRefNetworkChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const refNetworkName = event.target.value;
      dispatch(
        updateRefNetwork({
          selectedNetworkID,
          selectedBlockID,
          networkName: refNetworkName,
        }),
      );
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

  const handleParameterChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
      preserveCaret(event);
      const parameterValue = event.target.value;
      dispatch(
        updateParameter({
          selectedNetworkID,
          selectedBlockID,
          key,
          value: parameterValue,
        }),
      );
    },
    [selectedBlockID, selectedNetworkID],
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
