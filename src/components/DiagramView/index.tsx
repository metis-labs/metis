// Metis
// Copyright 2021-present NAVER Corp.
// Apache License v2.0

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import NearMeIcon from '@material-ui/icons/NearMe';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DiagramModel } from '@projectstorm/react-diagrams';

import { AppState } from 'app/rootReducer';
import {
  selectNetwork,
  deleteBlock,
  updateBlockPosition,
  addLink,
  deleteLink,
  updateCursorPosition,
} from 'features/docSlice';
import { Position } from 'features/peersSlice';
import { selectBlock, updateOffset, updateZoom } from 'features/localSlice';
import { BlockType } from 'store/types/blocks';
import Engine from 'components/DiagramView/Engine';
import MetisNodeModel from './MetisNodeModel';
import MetisLinkModel from './MetisLinkModel';
import SideBar from './SideBar';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'relative',
    },
    cursor: {
      position: 'absolute',
      display: 'flex',
    },
    cursorIcon: {
      transform: 'matrix(-1, 0, 0, 1, 0, 0)',
    },
    peerName: {
      position: 'relative',
      top: '10px',
      left: '-5px',
      color: 'white',
      padding: '2px 10px',
      borderRadius: '10px',
    },
    canvas: {
      marginTop: '64px',
      height: 'calc(100vh - 64px)',
      backgroundColor: '#eaeaeb',
    },
  }),
);

interface ChangeEvent {
  funcName: string;
  blockID: string;
  position?: Position;
}

export default function DiagramView() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const client = useSelector((state: AppState) => state.docState.client);
  const project = useSelector((state: AppState) => state.projectState.project);
  const peers = useSelector((state: AppState) => state.peerState.peers);
  const diagramInfoState = useSelector((state: AppState) => state.localInfoState.diagramInfos);
  const clientID = client.getID();

  const rootElement = useRef(null);
  const [engine] = useState(new Engine());
  const [changeEvents, setChangeEvents] = useState<{ [id: string]: ChangeEvent }>({});
  const selectedNetworkID = peers[clientID].selectedNetworkID;

  const handleMouseUp = useCallback(() => {
    for (const event of Object.values(changeEvents)) {
      const selectedBlockID = event.blockID;
      if (event.funcName === 'selectionChanged' && selectedBlockID) {
        dispatch(selectBlock({ selectedNetworkID, selectedBlockID }));
      } else if (event.funcName === 'positionChanged' && selectedBlockID) {
        const blockPosition = event.position;
        dispatch(updateBlockPosition({ selectedNetworkID, selectedBlockID, blockPosition }));
        dispatch(selectBlock({ selectedNetworkID, selectedBlockID }));
      }
    }
    setChangeEvents({});
  }, [changeEvents, selectedNetworkID]);

  const diagramInfo = diagramInfoState[selectedNetworkID];
  const rect = rootElement.current?.getBoundingClientRect();

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!rect) {
        return;
      }
      const cursorPosition: Position = {
        x: (event.nativeEvent.clientX - rect.x - diagramInfo.offset.x) / (diagramInfo.zoom / 100),
        y: (event.nativeEvent.clientY - rect.y - diagramInfo.offset.y) / (diagramInfo.zoom / 100),
      };
      dispatch(updateCursorPosition(cursorPosition));
    },
    [clientID, rect, diagramInfo, diagramInfoState],
  );

  useEffect(() => {
    const diagramInfo = diagramInfoState[selectedNetworkID];
    const network = project.networks[selectedNetworkID];
    engine.update(network, project.networks, diagramInfo);

    const deregister = engine.registerListener((event: any, entity: any) => {
      if (entity instanceof MetisNodeModel) {
        if (event.function === 'positionChanged' || event.function === 'selectionChanged') {
          // eslint-disable-next-line
          setChangeEvents((events) =>
            Object.assign(events, {
              [entity.getBlockID()]: {
                funcName: event.function,
                blockID: entity.getBlockID(),
                position: event.entity.position,
              },
            }),
          );
        } else if (event.function === 'entityRemoved') {
          const selectedBlockID = entity.getBlockID();
          dispatch(deleteBlock({ selectedNetworkID, selectedBlockID }));
        } else if (event.function === 'doubleClicked') {
          const network = project.networks[selectedNetworkID];
          const block = network.blocks[entity.getBlockID()];
          if (block.type !== BlockType.Network) {
            return;
          }
          const refNetworkID = block.refNetwork;
          dispatch(selectNetwork(refNetworkID));
        }
      } else if (entity instanceof MetisLinkModel) {
        if (event.function === 'targetPortChanged') {
          let from: any;
          let to: any;
          if (event.entity.sourcePort.getName() === 'in') {
            from = event.entity.targetPort.parent;
            to = event.entity.sourcePort.parent;
          } else if (event.entity.sourcePort.getName() === 'out') {
            from = event.entity.sourcePort.parent;
            to = event.entity.targetPort.parent;
          } else {
            return;
          }
          dispatch(
            addLink({
              selectedNetworkID,
              linkID: event.entity.getID(),
              fromBlockID: from.getBlockID(),
              toBlockID: to.getBlockID(),
            }),
          );
        } else if (event.function === 'entityRemoved') {
          dispatch(deleteLink({ networkID: selectedNetworkID, linkID: entity.getLinkID() }));
        }
      } else if (entity instanceof DiagramModel) {
        if (event.function === 'offsetUpdated') {
          dispatch(
            updateOffset({
              selectedNetworkID,
              offset: {
                x: entity.getOffsetX(),
                y: entity.getOffsetY(),
              },
            }),
          );
        } else if (event.function === 'zoomUpdated') {
          dispatch(
            updateZoom({
              selectedNetworkID,
              zoom: event.zoom,
            }),
          );
        }
      }
    });
    return () => deregister();
  }, [engine, project, setChangeEvents, selectedNetworkID]);

  const peerCursors = [];
  for (const [peerID, peer] of Object.entries(peers || {})) {
    if (
      clientID === peerID ||
      !peers[peerID] ||
      !peers[peerID].cursor ||
      peers[peerID].status === 'disconnected' ||
      peers[peerID].selectedNetworkID !== selectedNetworkID
    ) {
      continue;
    }
    peerCursors.push({
      id: peerID,
      username: peer.username,
      color: peer.color,
      cursor: peers[peerID].cursor,
    });
  }
  return (
    <div>
      <SideBar />
      <div
        role="presentation"
        ref={rootElement}
        className={classes.root}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <CanvasWidget className={classes.canvas} engine={engine.getEngine()} />
        {peerCursors.map((peerCursor) => {
          const pos = {
            x: peerCursor.cursor.x * (diagramInfo.zoom / 100) + diagramInfo.offset.x,
            y: peerCursor.cursor.y * (diagramInfo.zoom / 100) + diagramInfo.offset.y,
          };
          return (
            <div key={peerCursor.id} className={classes.cursor} style={{ left: pos.x, top: pos.y }}>
              <NearMeIcon className={classes.cursorIcon} style={{ color: peerCursor.color }} />
              <div className={classes.peerName} style={{ backgroundColor: peerCursor.color }}>
                {peerCursor.username}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
