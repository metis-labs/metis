import React, { ChangeEvent, useCallback } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { BlockType, isIOBlockType, PropertyValue, IOBlock } from 'store/types';
import { useAppState } from 'App';

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

export default function NetworkProperties(props: {block: IOBlock}) {
  const classes = useStyles();
  const [appState] = useAppState();
  const { selectedNetworkID } = appState.local;
  const { selectedBlockID } = appState.local.diagramInfos[selectedNetworkID];
  const { block: selectedBlock } = props;

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

  const handleKeyDown = useCallback((event: any) => {
    event.nativeEvent.stopImmediatePropagation();
  }, []);

  return (
    <div className={classes.section}>
      <Typography variant="h6">Properties</Typography>
      <FormControl className={classes.formControl}>
        <InputLabel id="type-select-label">Type</InputLabel>
        <Select
          id="type-select"
          labelId="type-select-label"
          value={selectedBlock.type}
          className={classes.formSelect}
          disabled
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
          onKeyDown={handleKeyDown}
        />
      </FormControl>
      {selectedBlock.type === BlockType.In && (
        <FormControl className={classes.formControl}>
          <TextField
            label="Init Variables"
            value={selectedBlock.initVariables || ''}
            onChange={(event) => handlePropertyChange(event, 'initVariables')}
            onKeyDown={handleKeyDown}
          />
        </FormControl>
      )}
    </div>
  );
}
