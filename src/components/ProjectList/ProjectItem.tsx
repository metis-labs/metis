import React, { useCallback, useRef, useState, useEffect, MouseEvent, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';

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
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import { DeleteProjectRequest } from 'api/metis_pb';
import { MetisPromiseClient } from 'api/metis_grpc_web_pb';
import { ProjectInfo } from 'store/types';
import { useAppState } from 'index';

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

type ProjectItemProps = {
  project: ProjectInfo;
};

export default function ProjectItem(props: ProjectItemProps) {
  const { project } = props;
  const classes = useStyles();
  const [, updateAppState] = useAppState();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [client] = useState<MetisPromiseClient>(new MetisPromiseClient('http://localhost:8080'));
  const [open, setOpen] = useState(false);
  const prevOpen = useRef(open);

  useEffect(() => {
    console.log(anchorRef.current);
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, [setOpen]);

  const handleListKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
      }
    },
    [setOpen],
  );

  const handleClose = useCallback(
    (event: MouseEvent<EventTarget>) => {
      if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
        return;
      }

      setOpen(false);
    },
    [anchorRef, setOpen],
  );

  const handleDeleteButtonClick = useCallback(
    (event: MouseEvent<EventTarget>) => {
      const req = new DeleteProjectRequest();
      req.setProjectId(project.id);
      client.deleteProject(req).then((res) => {
        updateAppState((appState) => {
          delete appState.local.projectInfos[project.id];
          return appState;
        });
      });
    },
    [updateAppState, client, project.id],
  );

  return (
    <Card className={classes.projectCard}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <>
            <IconButton
              ref={anchorRef}
              aria-label="settings"
              aria-controls={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              key={project.id}
            >
              <MoreVertIcon className={classes.moreIcon} />
            </IconButton>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                        <MenuItem className={classes.menuItem} onClick={handleDeleteButtonClick}>
                          Delete
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </>
        }
        title={<Link to={`/${project.id}`}>{project.name}</Link>}
        subheader="September 14, 2021"
      />
      <CardMedia className={classes.media} image="/static/images/cards/contemplative-reptile.jpg" />
    </Card>
  );
}
