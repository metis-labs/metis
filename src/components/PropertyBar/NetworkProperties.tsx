import React, { ChangeEvent, useCallback } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { Project, BlockType, isIOBlockType, PropertyValue, Network, NetworkBlock } from 'store/types';
import { useAppState } from 'App';
import { createNetworkParams, createParams } from 'module/initConverter';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    divider: {
      margin: '15px 0',
    },
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

function preserveCaret(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
  const caret = event.target.selectionStart;
  const element = event.target;
  window.requestAnimationFrame(() => {
    element.selectionStart = caret;
    element.selectionEnd = caret;
  });
}

export default function NetworkProperties(props: {block: NetworkBlock}) {
  const classes = useStyles();
  const [appState] = useAppState();
  const remoteState = appState.remote.getRoot();
  const project = remoteState.project as Project;
  const { selectedNetworkID } = appState.local;
  const { selectedBlockID } = appState.local.diagramInfos[selectedNetworkID];
  const { block: selectedBlock } = props;

  const otherNetworks = Object.values(project.networks).filter((network: any) => network.id !== selectedNetworkID);

  const onTypeChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      appState.remote.update((root) => {
        const { project } = root;
        const model = project.networks[selectedNetworkID];
        const type = event.target.value as BlockType;
        model.blocks[selectedBlockID].type = type;
        if (![BlockType.Network, BlockType.In, BlockType.Out].includes(type)) {
          model.blocks[selectedBlockID].parameters = createParams(type);
        } else {
          model.blocks[selectedBlockID].parameters = {};
        }
      });
    },
    [appState.remote, selectedBlockID, selectedNetworkID],
  );

  const onRefNetworkChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      appState.remote.update((root) => {
        const networkName = event.target.value;
        if (networkName) {
          const { project } = root;
          const networks = project.networks as { [networkID: string]: Network };
          const model = project.networks[selectedNetworkID];
          const network = Object.values(networks).find((network) => network.name === networkName);
          model.blocks[selectedBlockID].refNetwork = network.id;
          model.blocks[selectedBlockID].parameters = createNetworkParams(network);
        }
      });
    },
    [appState.remote, selectedBlockID, selectedNetworkID],
  );

  const valueTransition = (value: string): PropertyValue => {
    if (value === 'True' || value === 'true') {
      return true;
    }
    if (value === 'False' || value === 'false') {
      return false;
    }
    if (value === '') {
      return value;
    }
    if (!Number.isNaN(+value)) {
      return +value;
    }
    return value;
  };

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

  const handleKeyDown = useCallback((event: any) => {
    event.nativeEvent.stopImmediatePropagation();
  }, []);

  // TODO: rename attrName to parameterName
  const attrNames = Object.keys(selectedBlock.parameters);
  const refNetwork = selectedBlock.type === BlockType.Network ? project.networks[selectedBlock.refNetwork] : '';

  return (
    <>
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
          <InputLabel id="ref-network-select-label">Reference Network</InputLabel>
          <Select
            id="ref-network-select"
            labelId="ref-network-select-label"
            value={refNetwork ? refNetwork.name : ''}
            className={classes.formSelect}
            onChange={onRefNetworkChange}
          >
            {otherNetworks.map((network) => (
              <MenuItem key={network.name} value={network.name}>
                {network.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            label="Instance name"
            value={selectedBlock.name}
            onChange={(event) => handlePropertyChange(event, 'name')}
            onKeyDown={handleKeyDown}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            label="Repeats"
            value={selectedBlock.repeats}
            onChange={(event) => handlePropertyChange(event, 'repeats')}
            onKeyDown={handleKeyDown}
          />
        </FormControl>
      </div>
      <Divider className={classes.divider} />
      <div className={classes.section}>
        <Typography variant="h6">Parameters</Typography>
        <FormControl className={classes.formControl}>
          {attrNames.map((attrName) => (
            <TextField
              key={attrName}
              label={attrName}
              value={selectedBlock.parameters[attrName] || ''}
              onChange={(event) => handleParameterChange(event, attrName)}
              onKeyDown={handleKeyDown}
            />
          ))}
        </FormControl>
      </div>
    </>
  );
}
