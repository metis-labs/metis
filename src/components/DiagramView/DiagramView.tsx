import React, { useRef, useState, useCallback, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import NearMeIcon from '@material-ui/icons/NearMe';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DiagramModel } from '@projectstorm/react-diagrams';

import Engine from 'components/DiagramView/Engine';
import { Position } from 'store/types';
import useAppState from '../../index';
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

export default function DiagramView() {
  const classes = useStyles();

  const rootElement = useRef(null);
  const [appState, updateAppState] = useAppState();
  const [engine] = useState(new Engine());
  const [lastFunction, setLastFunction] = useState<string>();
  const [lastBlockID, setLastBlockID] = useState<string>();
  const [lastPosition, setLastPosition] = useState<Position>();
  const { selectedModelID } = appState.local;
  const { repaintCounter } = appState;

  const handleMouseUp = useCallback(() => {
    if (lastFunction === 'selectionChanged' && lastBlockID) {
      updateAppState((appState) => {
        appState.local.diagramInfos[selectedModelID].selectedBlockID = lastBlockID;
        return appState;
      });
    } else if (lastFunction === 'positionChanged' && lastBlockID) {
      appState.remote.update((root) => {
        const model = root.project.models[selectedModelID];
        model.blocks[lastBlockID].position = lastPosition;
      });

      updateAppState((appState) => {
        appState.local.diagramInfos[selectedModelID].selectedBlockID = lastBlockID;
        return appState;
      });
    }
  }, [lastFunction, lastBlockID, lastPosition, updateAppState, selectedModelID, appState.remote]);

  const diagramInfo = appState.local.diagramInfos[selectedModelID];
  const clientID = appState.local.myClientID;
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
    [clientID, appState.remote, rect, diagramInfo],
  );

  useEffect(() => {
    const {project} = appState.remote.getRoot();
    const diagramInfo = appState.local.diagramInfos[selectedModelID];
    const model = project.models[selectedModelID];
    engine.update(model, diagramInfo);
    const deregister = engine.registerListener((event: any, entity: any) => {
      setLastFunction(event.function);
      if (entity instanceof MetisNodeModel) {
        setLastBlockID(entity.getBlockID());
        if (event.function === 'positionChanged') {
          setLastPosition(event.entity.position);
        } else if (event.function === 'entityRemoved') {
          appState.remote.update((root) => {
            const model = root.project.models[selectedModelID];
            delete model.blocks[entity.getBlockID()];
          });
        }
      } else if (entity instanceof MetisLinkModel) {
        if (event.function === 'targetPortChanged') {
          appState.remote.update((root) => {
            const model = root.project.models[selectedModelID];
            let from; let to;
            if (event.entity.sourcePort.getName() === 'in') {
              from = event.entity.targetPort.parent;
              to = event.entity.sourcePort.parent;
            } else if (event.entity.sourcePort.getName() === 'out') {
              from = event.entity.sourcePort.parent;
              to = event.entity.targetPort.parent;
            } else {
              return;
            }

            model.links[entity.getID()] = {
              id: entity.getID(),
              from: from.getBlockID() as string,
              to: to.getBlockID() as string,
            };
          });
        } else if (event.function === 'entityRemoved') {
          appState.remote.update((root) => {
            const model = root.project.models[selectedModelID];
            // NOTE: If users don't complete the link, it won't store in remote.
            // So we only delete the link if it exists in remote.
            if (model.links[entity.getLinkID()]) {
              delete model.links[entity.getLinkID()];
            }
          });
        }
      } else if (entity instanceof DiagramModel) {
        if (event.function === 'offsetUpdated') {
          updateAppState((appState) => {
            appState.local.diagramInfos[selectedModelID].offset = {
              x: entity.getOffsetX(),
              y: entity.getOffsetY(),
            };
            return appState;
          });
        } else if (event.function === 'zoomUpdated') {
          updateAppState((appState) => {
            appState.local.diagramInfos[selectedModelID].zoom = event.zoom;
            return appState;
          });
        }
      }
    });
    return () => deregister();
  }, [
    engine,
    appState.remote,
    repaintCounter,
    selectedModelID,
    updateAppState,
    setLastFunction,
    setLastBlockID,
    setLastPosition,
  ]);

  const remotePeers = appState.remote.getRoot().peers;
  const {myClientID} = appState.local;

  const peers = [];
  for (const [peerID, peer] of Object.entries(appState.peers)) {
    if (
      myClientID === peerID ||
      !remotePeers[peerID] ||
      !remotePeers[peerID].cursor ||
      remotePeers[peerID].selectedModelID !== selectedModelID
    ) {
      continue;
    }
    peers.push({
      id: peerID,
      username: peer.username,
      color: peer.color,
      cursor: remotePeers[peerID].cursor,
    });
  }

  return (
    <div role="presentation" ref={rootElement} className={classes.root} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
      <CanvasWidget className={classes.canvas} engine={engine.getEngine()} />
      {peers.map((peer) => {
        const pos = {
          x: peer.cursor.x * (diagramInfo.zoom / 100) + diagramInfo.offset.x,
          y: peer.cursor.y * (diagramInfo.zoom / 100) + diagramInfo.offset.y,
        };
        // console.log('peer', { x: peer.cursor.x, y: peer.cursor.y })
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
  );
}
