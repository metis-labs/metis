import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import NearMeIcon from '@material-ui/icons/NearMe';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DiagramModel } from '@projectstorm/react-diagrams';

import Engine from 'components/DiagramView/Engine';
import { Position } from 'store/types/base';
import { BlockType } from 'store/types/blocks';

import { syncCursor, syncSelectedNetwork } from 'features/peersSlice';
import { syncSelfSelectedBlock, syncSelfSelectedNetwork, syncOffset, syncZoom } from 'features/localSlices';
import { AppState } from 'app/rootReducer';
import {
  updateBlockPosition,
  updateCursorPosition,
  updateDeletedBlock,
  updateDeletedLink,
  updatePortChange,
  updateSelectedNetworkID,
} from 'features/docSlices';
import SideBar from './SideBar';
import MetisNodeModel from './MetisNodeModel';
import MetisLinkModel from './MetisLinkModel';

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
  const peersState = useSelector((state: AppState) => state.peerState.peers);
  const doc = useSelector((state: AppState) => state.docState.doc);
  const diagramInfoState = useSelector((state: AppState) => state.localInfoState.diagramInfos);
  const client = useSelector((state: AppState) => state.docState.client);
  const clientID = client.getID();
  const repaintingCounter = useSelector((state: AppState) => state.docState.repaintingCounter);

  const rootElement = useRef(null);
  const [engine] = useState(new Engine());
  const [changeEvents, setChangeEvents] = useState<{ [id: string]: ChangeEvent }>({});
  const selectedNetworkID = useSelector((state: AppState) => state.localInfoState.selectedNetworkID);

  const handleMouseUp = useCallback(() => {
    for (const event of Object.values(changeEvents)) {
      if (event.funcName === 'selectionChanged' && event.blockID) {
        dispatch(syncSelfSelectedBlock({ networkID: selectedNetworkID, blockID: event.blockID }));
      } else if (event.funcName === 'positionChanged' && event.blockID) {
        dispatch(
          updateBlockPosition({ doc, networkID: selectedNetworkID, blockID: event.blockID, position: event.position }),
        );
        dispatch(syncSelfSelectedBlock({ networkID: selectedNetworkID, blockID: event.blockID }));
      }
    }

    setChangeEvents({});
  }, [changeEvents, selectedNetworkID, doc]);

  const diagramInfo = diagramInfoState[selectedNetworkID];
  const rect = rootElement.current?.getBoundingClientRect();
  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!rect) {
        return;
      }
      dispatch(
        updateCursorPosition({
          doc,
          clientID,
          position: {
            x: (event.nativeEvent.clientX - rect.x - diagramInfo.offset.x) / (diagramInfo.zoom / 100),
            y: (event.nativeEvent.clientY - rect.y - diagramInfo.offset.y) / (diagramInfo.zoom / 100),
          },
        }),
      );
    },
    [clientID, rect, diagramInfo, doc, diagramInfoState],
  );

  useEffect(() => {
    const { project } = doc.getRoot();
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
          dispatch(updateDeletedBlock({ doc, networkID: selectedNetworkID, blockID: entity.getBlockID() }));
        } else if (event.function === 'doubleClicked') {
          const network = project.networks[selectedNetworkID];
          const block = network.blocks[entity.getBlockID()];
          if (block.type !== BlockType.Network) {
            return;
          }
          const networkID = block.refNetwork;
          if (project.networks[networkID]) {
            dispatch(syncSelfSelectedNetwork({ networkID }));
          }
          dispatch(updateSelectedNetworkID({ client, doc, networkID }));
        }
      } else if (entity instanceof MetisLinkModel) {
        if (event.function === 'targetPortChanged') {
          dispatch(updatePortChange({ doc, networkID: selectedNetworkID, entity: event.entity }));
        } else if (event.function === 'entityRemoved') {
          dispatch(updateDeletedLink({ doc, networkID: selectedNetworkID, linkID: entity.getLinkID() }));
        }
      } else if (entity instanceof DiagramModel) {
        if (event.function === 'offsetUpdated') {
          dispatch(
            syncOffset({
              networkID: selectedNetworkID,
              offset: {
                x: entity.getOffsetX(),
                y: entity.getOffsetY(),
              },
            }),
          );
        } else if (event.function === 'zoomUpdated') {
          dispatch(
            syncZoom({
              networkID: selectedNetworkID,
              zoom: event.zoom,
            }),
          );
        }
      }
    });
    return () => deregister();
  }, [engine, doc, diagramInfoState, setChangeEvents, repaintingCounter]);

  useEffect(() => {
    const remoteDoc = doc.getRoot();
    Object.keys(peersState).forEach((clientID) =>
      remoteDoc.peers[clientID]?.cursor
        ? (dispatch(
            syncCursor({
              myClientID: clientID,
              x: remoteDoc.peers[clientID].cursor.x,
              y: remoteDoc.peers[clientID].cursor.y,
            }),
          ),
          dispatch(
            syncSelectedNetwork({
              myClientID: clientID,
              networkID: remoteDoc.peers[clientID].selectedNetworkID,
            }),
          ))
        : '',
    );
  }, [doc, syncCursor, syncSelectedNetwork]);

  const peers = [];
  for (const [peerID, peer] of Object.entries(peersState || {})) {
    if (
      clientID === peerID ||
      !peersState[peerID] ||
      !peersState[peerID].cursor ||
      peersState[peerID].status === 'disconnected' ||
      peersState[peerID].selectedNetworkID !== selectedNetworkID
    ) {
      continue;
    }
    peers.push({
      id: peerID,
      username: peer.username,
      color: peer.color,
      cursor: peersState[peerID].cursor,
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
        {peers.map((peer) => {
          const pos = {
            x: peer.cursor.x * (diagramInfo.zoom / 100) + diagramInfo.offset.x,
            y: peer.cursor.y * (diagramInfo.zoom / 100) + diagramInfo.offset.y,
          };
          return (
            <div key={peer.id} className={classes.cursor} style={{ left: pos.x, top: pos.y }}>
              <NearMeIcon className={classes.cursorIcon} style={{ color: peer.color }} />
              <div className={classes.peerName} style={{ backgroundColor: peer.color }}>
                {peer.username}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
