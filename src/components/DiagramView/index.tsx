import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import NearMeIcon from '@material-ui/icons/NearMe';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DiagramModel } from '@projectstorm/react-diagrams';

import Engine from 'components/DiagramView/Engine';
import { Position } from 'store/types/base';
import { BlockType } from 'store/types/blocks';
import { useAppState } from 'App';

import { syncCursor, syncSelectedNetwork } from 'features/peerInfoSlices';
import { AppState } from 'app/rootReducer';
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

  const rootElement = useRef(null);
  const [appState, updateAppState] = useAppState();
  const [engine] = useState(new Engine());
  const [changeEvents, setChangeEvents] = useState<{ [id: string]: ChangeEvent }>({});
  const { selectedNetworkID } = appState.local;
  const { remoteRepaintCounter } = appState;

  const handleMouseUp = useCallback(() => {
    for (const event of Object.values(changeEvents)) {
      if (event.funcName === 'selectionChanged' && event.blockID) {
        updateAppState((appState) => {
          appState.local.diagramInfos[selectedNetworkID].selectedBlockID = event.blockID;
          return appState;
        });
      } else if (event.funcName === 'positionChanged' && event.blockID) {
        appState.remote.update((root) => {
          const model = root.project.networks[selectedNetworkID];
          model.blocks[event.blockID].position = event.position;
        });
        updateAppState((appState) => {
          appState.local.diagramInfos[selectedNetworkID].selectedBlockID = event.blockID;
          return appState;
        });
      }
    }

    setChangeEvents({});
  }, [changeEvents, updateAppState, selectedNetworkID, appState.remote]);

  const diagramInfo = appState.local.diagramInfos[selectedNetworkID];
  const clientID = appState.client.getID();
  const rect = rootElement.current?.getBoundingClientRect();
  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!rect) {
        return;
      }

      appState.remote.update((root) => {
        root.peers[clientID].cursor = {
          x: (event.nativeEvent.clientX - rect.x - diagramInfo.offset.x) / (diagramInfo.zoom / 100),
          y: (event.nativeEvent.clientY - rect.y - diagramInfo.offset.y) / (diagramInfo.zoom / 100),
        };
      });
    },
    [clientID, appState.remote, rect, diagramInfo, syncCursor],
  );

  useEffect(() => {
    const { project } = appState.remote.getRoot();
    const diagramInfo = appState.local.diagramInfos[selectedNetworkID];
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
          appState.remote.update((root) => {
            const network = root.project.networks[selectedNetworkID];
            delete network.blocks[entity.getBlockID()];
          });
        } else if (event.function === 'doubleClicked') {
          const network = project.networks[selectedNetworkID];
          const block = network.blocks[entity.getBlockID()];
          if (block.type !== BlockType.Network) {
            return;
          }
          const networkID = block.refNetwork;
          updateAppState((appState) => {
            const { project } = appState.remote.getRoot();
            if (project.networks[networkID]) {
              appState.local.selectedNetworkID = networkID;
            }
            return appState;
          });

          appState.remote.update((root) => {
            root.peers[clientID].selectedNetworkID = networkID;
          });
        }
      } else if (entity instanceof MetisLinkModel) {
        if (event.function === 'targetPortChanged') {
          appState.remote.update((root) => {
            const network = root.project.networks[selectedNetworkID];
            let from;
            let to;
            if (event.entity.sourcePort.getName() === 'in') {
              from = event.entity.targetPort.parent;
              to = event.entity.sourcePort.parent;
            } else if (event.entity.sourcePort.getName() === 'out') {
              from = event.entity.sourcePort.parent;
              to = event.entity.targetPort.parent;
            } else {
              return;
            }

            network.links[entity.getID()] = {
              id: entity.getID(),
              from: from.getBlockID(),
              to: to.getBlockID(),
            };
          });
        } else if (event.function === 'entityRemoved') {
          appState.remote.update((root) => {
            const network = root.project.networks[selectedNetworkID];
            // NOTE: If users don't complete the link, it won't store in remote.
            // So we only delete the link if it exists in remote.
            if (network.links[entity.getLinkID()]) {
              delete network.links[entity.getLinkID()];
            }
          });
        }
      } else if (entity instanceof DiagramModel) {
        if (event.function === 'offsetUpdated') {
          updateAppState((appState) => {
            appState.local.diagramInfos[selectedNetworkID].offset = {
              x: entity.getOffsetX(),
              y: entity.getOffsetY(),
            };
            return appState;
          });
        } else if (event.function === 'zoomUpdated') {
          updateAppState((appState) => {
            appState.local.diagramInfos[selectedNetworkID].zoom = event.zoom;
            return appState;
          });
        }
      }
    });
    return () => deregister();
  }, [engine, appState.remote, remoteRepaintCounter, selectedNetworkID, updateAppState, setChangeEvents]);

  // redux
  useEffect(() => {
    const remoteDoc = appState.remote.getRoot();
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
  }, [syncCursor]);
  //

  const myClientID = appState.client.getID();

  const peers = [];
  for (const [peerID, peer] of Object.entries(peersState || {})) {
    if (
      myClientID === peerID ||
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
