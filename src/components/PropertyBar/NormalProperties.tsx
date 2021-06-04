import React, { ChangeEvent, useCallback } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl/FormControl';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { NormalBlock, getOrderedParamNames } from 'store/types/blocks';

import { changePrameter, changeProperty } from 'features/docSlice';
import { AppState } from 'app/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
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

export default function NetworkProperties(props: { block: NormalBlock }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const doc = useSelector((state: AppState) => state.docState.doc);
  const repaintCounter = useSelector((state: AppState) => state.docState.repaintingCounter);
  const diagramInfos = useSelector((state: AppState) => state.localInfoState.diagramInfos);
  const client = useSelector((state: AppState) => state.docState.client);
  const peers = useSelector((state: AppState) => state.peerState.peers);
  const selectedNetworkID = peers[client.getID()].selectedNetworkID;
  const { selectedBlockID } = diagramInfos[selectedNetworkID];
  const { block: selectedBlock } = props;

  const handlePropertyChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
      preserveCaret(event);
      dispatch(changeProperty({ doc, selectedNetworkID, selectedBlockID, event, key }));
    },
    [doc, selectedBlockID, selectedNetworkID, repaintCounter],
  );

  const handleParameterChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
      preserveCaret(event);
      dispatch(changePrameter({ doc, selectedNetworkID, selectedBlockID, event, key }));
    },
    [doc, selectedBlockID, selectedNetworkID, repaintCounter],
  );

  const paramNames = getOrderedParamNames(selectedBlock.type);

  return (
    <>
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
        <FormControl className={classes.formControl}>
          {paramNames.map((paramName) => (
            <TextField
              key={paramName}
              label={paramName}
              value={selectedBlock.parameters[paramName] || ''}
              onChange={(event) => handleParameterChange(event, paramName)}
              onKeyDown={stopPropagationOnKeydown}
            />
          ))}
        </FormControl>
      </div>
    </>
  );
}
