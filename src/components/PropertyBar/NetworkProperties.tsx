import React, { ChangeEvent, useCallback } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { Project, BlockType, NetworkBlock } from 'store/types';
import { useAppState } from 'App';
import { createNetworkParams } from 'module/initConverter';

import { valueTransition, preserveCaret, stopPropagationOnKeydown } from './utils';

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
  const [appState] = useAppState();
  const remoteState = appState.remote.getRoot();
  const project = remoteState.project as Project;
  const { selectedNetworkID } = appState.local;
  const { selectedBlockID } = appState.local.diagramInfos[selectedNetworkID];
  const { block: selectedBlock } = props;

  const otherNetworks = Object.values(project.networks).filter((network: any) => network.id !== selectedNetworkID);

  const onRefNetworkChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      appState.remote.update((root) => {
        const networkName = event.target.value;
        const project = root.project as Project;
        const network = project.networks[selectedNetworkID];

        // Update network block
        const targetNetwork = Object.values(project.networks).find((network) => network.name === networkName);
        const block = network.blocks[selectedBlockID];
        if (block.type === BlockType.Network) {
          block.refNetwork = targetNetwork ? targetNetwork.id : '';
          block.parameters = targetNetwork ? createNetworkParams(targetNetwork) : {};
        }

        // Update dependencies
        const refNetBlockList = [];
        (Object.values(network.blocks).filter(
          (block) => block.type === BlockType.Network,
        ) as NetworkBlock[]).map((block) =>
          block.refNetwork ? refNetBlockList.push(project.networks[block.refNetwork].name) : '',
        );
        refNetBlockList.push.apply(refNetBlockList, ['torch', 'torchNN']);
        const notInRefs = Object.keys(network.dependencies).filter((dep) => !refNetBlockList.includes(dep));
        notInRefs.map((notInRef) => delete network.dependencies[notInRef]);
        if (networkName) {
          network.dependencies[networkName] = {
            id: networkName,
            name: networkName,
            package: networkName,
          };
        }
      });
    },
    [appState.remote, selectedBlockID, selectedNetworkID],
  );

  const handlePropertyChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
      preserveCaret(event);
      appState.remote.update((root) => {
        const { project } = root;
        const model = project.networks[selectedNetworkID];
        model.blocks[selectedBlockID][key] = valueTransition(event.target.value as string);
      });
    },
    [appState.remote, selectedBlockID, selectedNetworkID],
  );

  const handleParameterChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
      preserveCaret(event);
      appState.remote.update((root) => {
        const { project } = root;
        const model = project.networks[selectedNetworkID];
        model.blocks[selectedBlockID].parameters[key] = valueTransition(event.target.value as string);
      });
    },
    [appState.remote, selectedBlockID, selectedNetworkID],
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
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {otherNetworks.map((network) => (
            <MenuItem key={network.name} value={network.name}>
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
