import React, {ChangeEvent, useCallback} from 'react';
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

import { useProject } from '../../index';
import { BlockType, PreservedBlockTypes, PropertyValue } from 'store/types';

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

export default function PropertyBar() {
  const classes = useStyles();
  const [project, updateProject] = useProject();

  const onTypeChange = useCallback((event: ChangeEvent<{ value: unknown }>) => {
    updateProject((project) => {
      const fragment = project.fragments[project.selectedFragmentId];
      fragment.blocks[fragment.selectedBlockID].type = event.target.value as BlockType;
      return project;
    });
  }, [updateProject]);

  const handlePropertyChange = useCallback((event: ChangeEvent<{ value: unknown}>, key: string) => {
    updateProject((project) => {
      const fragment = project.fragments[project.selectedFragmentId];
      fragment.blocks[fragment.selectedBlockID][key] = valueTransition(event.target.value as string);
      return project;
    });
  }, [updateProject]);

  const handleParameterChange = useCallback((event: ChangeEvent<{value: unknown}>, key: string) => {
    updateProject((project) => {
      const fragment = project.fragments[project.selectedFragmentId];
      fragment.blocks[fragment.selectedBlockID].parameters[key] = valueTransition(event.target.value as string);
      return project;
    });
  }, [updateProject]);

  const handleKeyDown = useCallback((event: any) => {
    event.nativeEvent.stopImmediatePropagation();
  }, []);

  const valueTransition = (value: string): PropertyValue => {
    if (value === 'True' || value === 'true') {
      return true;
    } else if (value === 'False' || value === 'false') {
      return false;
    } else if (!isNaN(+value)) {
      return +value;
    } else {
      return value;
    }
  }

  const fragment = project.fragments[project.selectedFragmentId];
  if (!fragment.selectedBlockID || !fragment.blocks[fragment.selectedBlockID]) {
    return null;
  }

  const selectedBlock = fragment.blocks[fragment.selectedBlockID];
  return (
    <Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }} anchor="right">
      <Toolbar />
      <Divider />
      <div className={classes.section}>
        <Typography variant="h6">Properties</Typography>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="grouped-native-select">Type</InputLabel>
          <Select
            id="grouped-select"
            value={selectedBlock.type}
            className={classes.formSelect}
            onChange={onTypeChange}
            disabled={PreservedBlockTypes.has(selectedBlock.type)}
          >
            {Object.keys(BlockType).map((item) => (
              <MenuItem key={item} value={item} disabled={PreservedBlockTypes.has(item as BlockType)}>
                {item}
              </MenuItem>
            ))}
          </Select>
          {selectedBlock.name !== undefined &&
          <TextField
            label="Instance name"
            value={selectedBlock.name}
            onChange={(event) => handlePropertyChange(event, "name")}
            onKeyDown={handleKeyDown}
          />
          }
          {selectedBlock.repeats !== undefined &&
            <TextField
              label="Repeats"
              value={selectedBlock.repeats}
              onChange={(event) => handlePropertyChange(event, "repeats")}
              onKeyDown={handleKeyDown}
            />
          }
        </FormControl>
      </div>
      {selectedBlock.parameters && <>
        <Divider className={classes.divider}/>
        <div className={classes.section}>
          <Typography variant="h6">Parameters</Typography>
          <FormControl className={classes.formControl}>
            {Object.entries(selectedBlock.parameters).map(([key, value]) => (
              <TextField
                key={key}
                label={key}
                value={value}
                onChange={(event) => handleParameterChange(event, key)}
                onKeyDown={handleKeyDown}
              />
            ))}
          </FormControl>
        </div>
        </>
      }
    </Drawer>
  );
}
