import React, { KeyboardEvent, MouseEvent, useRef, useState, useEffect, useCallback } from 'react';
import { animated, useSpring } from 'react-spring';
import { createStyles, fade, Theme, withStyles, makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import { TransitionProps } from '@material-ui/core/transitions';
import Collapse from '@material-ui/core/Collapse';

import { Model } from 'store/types';

export const StyledTreeItem = withStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      '& .close': {
        opacity: 0.3,
      },
    },
    group: {
      marginLeft: 7,
      paddingLeft: 18,
      borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
  }),
)((props: TreeItemProps) => <TreeItem {...props} TransitionComponent={TransitionComponent} />);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    treeItemStyle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    moreIcon: {
      display: 'none',
    },
    moreIconShow: {
      height: '24px',
      width: '24px',
      display: 'flex',
    },
    moreItemStyle: {
      fontSize: 'medium',
    },
    menuItem: {
      fontSize: 'small',
      height: '24px',
    },
  }),
);

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

export default function FileTreeItem(props: { model: Model }) {
  const classes = useStyles();
  const { model } = props;
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const prevOpen = useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, [setOpen]);

  const handleClose = useCallback(
    (event: MouseEvent<EventTarget>) => {
      if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
        return;
      }

      setOpen(false);
    },
    [anchorRef, setOpen],
  );

  const handleListKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
      }
    },
    [setOpen],
  );

  const handleMouseEnter = useCallback(
    (event: MouseEvent<EventTarget>) => {
      setShow(true);
    },
    [setShow],
  );

  const handleMouseLeave = useCallback(
    (event: MouseEvent<EventTarget>) => {
      setShow(false);
    },
    [setShow],
  );

  return (
    <div className={classes.treeItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <StyledTreeItem
        key={model.id}
        nodeId={model.id}
        label={model.name}
      />
      <IconButton
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        className={show ? classes.moreIconShow : classes.moreIcon}
      >
        <MoreVertIcon className={classes.moreItemStyle} />
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
                  <MenuItem className={classes.menuItem} onClick={handleClose}>
                    Rename
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}
