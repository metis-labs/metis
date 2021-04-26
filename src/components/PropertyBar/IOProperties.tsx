import React, { ChangeEvent, useCallback } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl/FormControl';
import TextField from '@material-ui/core/TextField';

import { BlockType, IOBlock } from 'store/types';
import { useAppState } from 'App';

import { valueTransition, preserveCaret, stopPropagationOnKeydown } from './utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // necessary for content to be below app bar
    formControl: {
      margin: theme.spacing(1),
      width: 200,
    },
  }),
);

export default function NetworkProperties(props: {block: IOBlock}) {
  const classes = useStyles();
  const [appState] = useAppState();
  const { selectedNetworkID } = appState.local;
  const { selectedBlockID } = appState.local.diagramInfos[selectedNetworkID];
  const { block: selectedBlock } = props;

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

  return (
    <>
      {selectedBlock.type === BlockType.In && (
        <FormControl className={classes.formControl}>
          <TextField
            label="Init Variables"
            value={selectedBlock.initVariables || ''}
            onChange={(event) => handlePropertyChange(event, 'initVariables')}
            onKeyDown={stopPropagationOnKeydown}
          />
        </FormControl>
      )}
    </>
  );
}
