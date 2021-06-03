import React, { ChangeEvent, useCallback } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl/FormControl';
import TextField from '@material-ui/core/TextField';

import { BlockType, IOBlock } from 'store/types/blocks';

import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';
import { changeProperty } from 'features/docSlices';
import { preserveCaret, stopPropagationOnKeydown } from './utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // necessary for content to be below app bar
    formControl: {
      margin: theme.spacing(1),
      width: 200,
    },
  }),
);

export default function NetworkProperties(props: { block: IOBlock }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const doc = useSelector((state: AppState) => state.docState.doc);
  const selectedNetworkID = useSelector((state: AppState) => state.localInfoState.selectedNetworkID);
  const diagramInfos = useSelector((state: AppState) => state.localInfoState.diagramInfos);
  const { selectedBlockID } = diagramInfos[selectedNetworkID];
  const { block: selectedBlock } = props;

  const handlePropertyChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
      preserveCaret(event);
      dispatch(changeProperty({ doc, event, selectedNetworkID, selectedBlockID, key }));
    },
    [doc, selectedBlockID, selectedNetworkID],
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
