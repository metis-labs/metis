// Metis
// Copyright 2021-present NAVER Corp.
// Apache License v2.0

import React, { ChangeEvent, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';
import TreeView from '@material-ui/lab/TreeView';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import { AppState } from 'app/rootReducer';
import { addNetwork, selectNetwork } from 'features/docSlice';
import { Peer } from 'features/peersSlice';
import FileTreeItem, { StyledTreeItem } from './FileTreeItem';

function MinusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props: SvgIconProps) {
  return (
    <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    treeItemStyle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    root: {
      height: 264,
      flexGrow: 1,
      maxWidth: 400,
      margin: theme.spacing(1.5),
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    toolbar: {
      position: 'absolute',
      top: 75,
      left: 200,
      zIndex: 1,
    },
    addModelButton: {
      height: 24,
      width: 24,
    },
    buttonContainer: {
      position: 'relative',
    },
  }),
);

export default function FileTreeBar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const client = useSelector((state: AppState) => state.docState.client);
  const project = useSelector((state: AppState) => state.projectState.project);
  const peers = useSelector((state: AppState) => state.peerState.peers);
  const selectedNetworkID = peers[client.getID()].selectedNetworkID;
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    setExpanded([project.id]);
  }, [project.id]);

  const handleToggle = useCallback((event: ChangeEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  }, []);

  const handleNodeSelect = useCallback(
    (event: ChangeEvent, networkID: any) => {
      if (!project.networks[networkID]) {
        return;
      }
      dispatch(selectNetwork(networkID));
    },
    [project, client],
  );

  const handleAddNetwork = useCallback(async () => {
    const networkName = 'Untitled';
    dispatch(addNetwork(networkName));
  }, [client]);

  // TODO(youngteac.hong): Replace below with type parameter.
  const peersMapByNetworkID: { [networkID: string]: Array<Peer> } = {};
  for (const [peerID, peer] of Object.entries(peers || {})) {
    const peerInRemote = peers[peerID];
    if (!peerInRemote || peerInRemote.status === 'disconnected') {
      continue;
    }

    const { selectedNetworkID } = peerInRemote;
    if (!peersMapByNetworkID[selectedNetworkID]) {
      peersMapByNetworkID[selectedNetworkID] = [];
    }
    peersMapByNetworkID[selectedNetworkID].push(peer);
  }

  return (
    <Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }}>
      <Toolbar />
      <div className={classes.toolbar}>
        <IconButton className={classes.addModelButton} onClick={handleAddNetwork}>
          <AddIcon fontSize="small" />
        </IconButton>
      </div>
      <TreeView
        className={classes.root}
        selected={[selectedNetworkID]}
        expanded={expanded}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
        onNodeToggle={handleToggle}
        onNodeSelect={handleNodeSelect}
      >
        <StyledTreeItem nodeId={project.id} label={project.name}>
          {Object.values(project.networks)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((network) => (
              <FileTreeItem key={network.id} network={network} peers={peersMapByNetworkID[network.id]} />
            ))}
        </StyledTreeItem>
      </TreeView>
    </Drawer>
  );
}
