import React, { useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

export interface RenameDialogProps {
  open: boolean;
  name: string;
  onClose: (value: string) => void;
}

export default function RenameDialog(props: RenameDialogProps) {
  const { name, onClose, open } = props;
  const nameInput = useRef<TextFieldProps>(null);

  const handleClose = () => {
    onClose(nameInput.current.value as string);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="rename-dialog-title" open={open}>
      <DialogTitle id="rename-dialog-title">Rename project</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter a new project name:</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Project Name"
          type="text"
          defaultValue={name}
          inputRef={nameInput}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Ok</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}