import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl/FormControl';

import Select from "@material-ui/core/Select";
import { Block, BlockType } from 'model/model';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';

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
    }
  }),
);

export default function PropertyBar(props: {
    selectedBlock: Block | undefined,
}) {
  const classes = useStyles();
  const { selectedBlock } = props;

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="right"
    >
      <Toolbar />
      <Divider />
      <FormControl className={classes.formControl}>
          <InputLabel htmlFor="grouped-native-select">Type</InputLabel>
          <Select native defaultValue="" id="grouped-select" className={classes.formSelect}>
            {
                Object.keys(BlockType).map((item) =>
                    <option key={item} value={item} selected={selectedBlock?.getType() === item}>{item}</option>
                )
            }
          </Select>
      </FormControl>
    </Drawer>
  );
}
