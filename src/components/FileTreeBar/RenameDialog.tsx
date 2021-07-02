// Metis
// Copyright 2021-present NAVER Corp.
// Apache License v2.0

import React, { useRef, useCallback, KeyboardEvent } from 'react';
import Button from '@material-ui/core/Button';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

export default function RenameDialog(props: { open: boolean; name: string; onClose: (value?: string) => void }) {
  const { name, onClose, open } = props;
  const nameInput = useRef<TextFieldProps>(null);

  const handleOk = useCallback(() => {
    onClose(nameInput.current.value as string);
  }, [onClose]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onClose(nameInput.current.value as string);
      }
    },
    [onClose],
  );

  return (
    <Dialog onClose={handleCancel} aria-labelledby="rename-dialog-title" open={open}>
      <DialogTitle id="rename-dialog-title">Rename model</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter a new model name:</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Model Name"
          type="text"
          defaultValue={name}
          inputRef={nameInput}
          onKeyPress={handleKeyPress}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
