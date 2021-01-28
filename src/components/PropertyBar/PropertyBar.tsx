import React, { useCallback } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import TextField from '@material-ui/core/TextField';

import { useFragment } from '../../index';
import { BlockType } from 'store/types';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginRight: drawerWidth,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    formSelect: {
      marginTop: 16,
    },
  }),
);

export default function PropertyBar() {
  const classes = useStyles();
  const [fragment, updateFragment] = useFragment();

  const onChange = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      updateFragment((fragment) => {
        fragment.blocks[fragment.selectedBlockID].type = event.target.value as BlockType;
        return fragment;
      });
    },
    [updateFragment],
  );

  if (!fragment.selectedBlockID || !fragment.blocks[fragment.selectedBlockID]) {
    return <></>;
  }

  const selectedBlock = fragment.blocks[fragment.selectedBlockID];
  return (
    <Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }} anchor="right">
      <Toolbar />
      <Divider />
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="grouped-native-select">Type</InputLabel>
        <Select id="grouped-select" value={selectedBlock.type} className={classes.formSelect} onChange={onChange}>
          {Object.keys(BlockType).map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
        {selectedBlock.properties &&
          Object.entries(selectedBlock.properties).map(([key, value]) => (
            <TextField key={key} label={key} value={value} />
          ))}
      </FormControl>
    </Drawer>
  );
}
