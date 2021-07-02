// Metis
// Copyright 2021-present NAVER Corp.
// Apache License v2.0

import React, { useCallback, useRef, useState, useEffect, MouseEvent, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import api from 'api';
import { deleteProject, ProjectInfo, renameProject } from 'features/projectInfosSlice';
import RenameDialog from './RenameDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: 50,
    },
    createCard: {
      textAlign: 'center',
      height: '100%',
    },
    projectCard: {
      width: 290,
      height: 330,
    },
    avatar: {
      backgroundColor: theme.palette.primary.main,
    },
    media: {
      backgroundColor: '#ebebeb',
      height: 260,
    },
    moreIcon: {
      fontSize: 'medium',
    },
    menuItem: {
      fontSize: 'small',
      height: '24px',
    },
  }),
);

type ProjectInfoProps = {
  projectInfo: ProjectInfo;
};

export default function ProjectCard(props: ProjectInfoProps) {
  const { projectInfo } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [popperOpen, setPopperOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const prevOpen = useRef(popperOpen);

  useEffect(() => {
    if (prevOpen.current === true && popperOpen === false) {
      anchorRef.current!.focus();
    }
    prevOpen.current = popperOpen;
  }, [popperOpen]);

  const handleToggle = useCallback(() => {
    setPopperOpen((prevOpen) => !prevOpen);
  }, [setPopperOpen]);

  const handleListKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        setPopperOpen(false);
      }
    },
    [setPopperOpen],
  );

  const handleClose = useCallback(
    (event: MouseEvent<EventTarget>) => {
      if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
        return;
      }

      setPopperOpen(false);
    },
    [anchorRef, setPopperOpen],
  );

  const handleRenameButtonClick = useCallback(() => {
    setRenameDialogOpen(true);
  }, [setRenameDialogOpen]);

  const handleRenameDialogClose = useCallback(
    (projectName: string | undefined) => {
      if (projectName) {
        api.updateProject(projectInfo.id, projectName).then(() => {
          dispatch(renameProject({ projectID: projectInfo.id, projectName }));
        });
      }

      setRenameDialogOpen(false);
      setPopperOpen(false);
    },
    [setRenameDialogOpen, projectInfo.id],
  );

  const handleDeleteButtonClick = useCallback(() => {
    api.deleteProject(projectInfo.id).then(() => {
      dispatch(deleteProject(projectInfo.id));
    });
  }, [projectInfo.id]);

  return (
    <Card className={classes.projectCard}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            P
          </Avatar>
        }
        action={
          <>
            <IconButton
              ref={anchorRef}
              aria-label="settings"
              aria-controls={popperOpen ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              key={projectInfo.id}
            >
              <MoreVertIcon className={classes.moreIcon} />
            </IconButton>
            <Popper open={popperOpen} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <List id="menu-list-grow" onKeyDown={handleListKeyDown}>
                        <MenuItem className={classes.menuItem} onClick={handleRenameButtonClick}>
                          Rename
                        </MenuItem>
                        <RenameDialog
                          name={projectInfo.name}
                          open={renameDialogOpen}
                          onClose={handleRenameDialogClose}
                        />
                        <MenuItem className={classes.menuItem} onClick={handleDeleteButtonClick}>
                          Delete
                        </MenuItem>
                      </List>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </>
        }
        title={<Link to={`/${projectInfo.id}`}>{projectInfo.name}</Link>}
        subheader={projectInfo.createdAt.toLocaleString()}
      />
      <CardMedia className={classes.media} image="/static/images/cards/contemplative-reptile.jpg" />
    </Card>
  );
}
