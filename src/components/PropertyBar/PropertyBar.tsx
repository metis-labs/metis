import React, { ChangeEvent, useCallback } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { BlockType, IOBlockTypes, PropertyValue, Model } from 'store/types';
import { useAppState } from 'App';
import { createNetworkParams, createParams, getOrderedAttrNames } from 'module/initConverter';

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

export default function PropertyBar() {
  const classes = useStyles();
  const [appState] = useAppState();
  const { project } = appState.remote.getRoot();
  const { selectedModelID } = appState.local;
  const { selectedBlockID } = appState.local.diagramInfos[selectedModelID];

  const networks = Object.values(project.models).filter(
    (network: any) => network.id !== selectedModelID,
  ) as Array<Model>;

  const onTypeChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      appState.remote.update((root) => {
        const { project } = root;
        const model = project.models[selectedModelID];
        const type = event.target.value as BlockType;
        model.blocks[selectedBlockID].type = type;
        if (![BlockType.Network, BlockType.In, BlockType.Out].includes(type)) {
          model.blocks[selectedBlockID].parameters = createParams(type);
        } else {
          model.blocks[selectedBlockID].parameters = {};
        }
      });
    },
    [appState.remote, selectedBlockID, selectedModelID],
  );

  const onRefNetworkChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      appState.remote.update((root) => {
        const networkID = event.target.value;
        if (networkID) {
          const { project } = root;
          const model = project.models[selectedModelID];
          const network = project.models[networkID];
          model.blocks[selectedBlockID].refNetwork = networkID;
          model.blocks[selectedBlockID].parameters = createNetworkParams(network);
        }
      });
    },
    [appState.remote, selectedBlockID, selectedModelID],
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
        const model = project.models[selectedModelID];
        model.blocks[selectedBlockID][key] = valueTransition(event.target.value as string);
      });
    },
    [appState.remote, selectedBlockID, selectedModelID],
  );

  const handleParameterChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
      preserveCaret(event);
      appState.remote.update((root) => {
        const { project } = root;
        const model = project.models[selectedModelID];
        model.blocks[selectedBlockID].parameters[key] = valueTransition(event.target.value as string);
      });
    },
    [appState.remote, selectedBlockID, selectedModelID],
  );

  const handleKeyDown = useCallback((event: any) => {
    event.nativeEvent.stopImmediatePropagation();
  }, []);

  const model = project.models[selectedModelID];
  if (!selectedBlockID || !model.blocks[selectedBlockID]) {
    return null;
  }

  const selectedBlock = model.blocks[selectedBlockID];

  // TODO: rename attrName to parameterName
  let attrNames;
  if (selectedBlock.type === BlockType.Network) {
    attrNames = Object.keys(selectedBlock.parameters);
  } else {
    attrNames = getOrderedAttrNames(selectedBlock.type);
  }

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
            disabled={IOBlockTypes.has(selectedBlock.type)}
          >
            {Object.keys(BlockType).map((item) => (
              <MenuItem key={item} value={item} disabled={IOBlockTypes.has(item as BlockType)}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* TODO: Overlap between input and label */}
        <FormControl className={classes.formControl}>
          {selectedBlock.type === BlockType.Network && (
            <>
              <InputLabel id="ref-network-select-label">Reference Network</InputLabel>
              <Select
                id="ref-network-select"
                labelId="ref-network-select-label"
                value={selectedBlock.refNetwork}
                className={classes.formSelect}
                onChange={onRefNetworkChange}
              >
                {networks.map((network) => (
                  <MenuItem key={network.name} value={network.name}>
                    {network.name}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            label="Instance name"
            value={selectedBlock.name}
            onChange={(event) => handlePropertyChange(event, 'name')}
            onKeyDown={handleKeyDown}
          />
          {selectedBlock.repeats !== undefined && (
            <TextField
              label="Repeats"
              value={selectedBlock.repeats}
              onChange={(event) => handlePropertyChange(event, 'repeats')}
              onKeyDown={handleKeyDown}
            />
          )}
          {selectedBlock.type === BlockType.In && (
            <TextField
              label="Init Variables"
              value={selectedBlock.initVariables || ''}
              onChange={(event) => handlePropertyChange(event, 'initVariables')}
              onKeyDown={handleKeyDown}
            />
          )}
          {selectedBlock.type === BlockType.Network && (
            <TextField
              label="Reference Network"
              value={selectedBlock.refNetwork || ''}
              onChange={(event) => handlePropertyChange(event, 'refNetwork')}
              onKeyDown={handleKeyDown}
            />
          )}
        </FormControl>
      </div>
      {selectedBlock.parameters && (
        <>
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
      )}
    </Drawer>
  );
}
