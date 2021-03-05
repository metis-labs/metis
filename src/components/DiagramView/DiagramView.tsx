import React, { useState, useCallback, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { CanvasWidget } from '@projectstorm/react-canvas-core';

import { Engine } from 'components/DiagramView/Engine';
import { Position } from 'store/types';
import { useAppState } from '../../index';
import { MetisNodeModel } from './MetisNodeModel';
import { MetisLinkModel } from './MetisLinkModel';
import { DiagramModel } from '@projectstorm/react-diagrams';

const useStyles = makeStyles(() =>
  createStyles({
    canvas: {
      marginTop: '64px',
      height: 'calc(100vh - 64px)',
      backgroundColor: '#eaeaeb',
    },
  }),
);

export default function DiagramView() {
  const classes = useStyles();

  const [appState, updateAppState] = useAppState();
  const [engine] = useState(new Engine());
  const [lastFunction, setLastFunction] = useState<string>();
  const [lastBlockID, setLastBlockID] = useState<string>();
  const [lastPosition, setLastPosition] = useState<Position>();
  const selectedModelID = appState.local.selectedModelID;
  const repaintCounter = appState.repaintCounter;

  const handleMouseUp = useCallback(
    (event: any) => {
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
    },
    [lastFunction, lastBlockID, lastPosition, updateAppState, selectedModelID, appState.remote],
  );

  useEffect(() => {
    const project = appState.remote.getRootObject().project;
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
            let from, to;
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
            delete model.links[entity.getLinkID()];
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    engine,
    appState.remote,
    repaintCounter,
    selectedModelID,
    updateAppState,
    setLastFunction,
    setLastBlockID,
    setLastPosition
  ]);

  return (
    <div onMouseUp={handleMouseUp}>
      <CanvasWidget className={classes.canvas} engine={engine.getEngine()} />
    </div>
  );
}
