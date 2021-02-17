import React, { useState, useCallback, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { CanvasWidget } from '@projectstorm/react-canvas-core';

import { Engine } from 'components/DiagramView/Engine';
import { Position } from 'store/types';
import { useProject } from '../../index';
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

  const [project, updateProject] = useProject();
  const [engine] = useState(new Engine());
  const [lastFunction, setLastFunction] = useState<string>();
  const [lastBlockID, setLastBlockID] = useState<string>();
  const [lastPosition, setLastPosition] = useState<Position>();

  const handleMouseUp = useCallback(
    (event: any) => {
      if (lastFunction === 'selectionChanged' && lastBlockID) {
        updateProject((project) => {
          const model = project.models[project.selectedModelID];
          model.selectedBlockID = lastBlockID;
          return project;
        });
      } else if (lastFunction === 'positionChanged' && lastBlockID) {
        updateProject((project) => {
          const model = project.models[project.selectedModelID];
          model.blocks[lastBlockID].position = lastPosition;
          model.selectedBlockID = lastBlockID;
          return project;
        });
      }
    },
    [lastFunction, lastBlockID, lastPosition, updateProject],
  );

  useEffect(() => {
    const model = project.models[project.selectedModelID];
    engine.update(model);
    const deregister = engine.registerListener((event: any, entity: any) => {
      setLastFunction(event.function);
      if (entity instanceof MetisNodeModel) {
        setLastBlockID(entity.getBlockID());
        if (event.function === 'positionChanged') {
          setLastPosition(event.entity.position);
        } else if (event.function === 'entityRemoved') {
          updateProject((project) => {
            const model = project.models[project.selectedModelID];
            delete model.blocks[entity.getBlockID()];
            return project;
          });
        }
      } else if (entity instanceof MetisLinkModel) {
        if (event.function === 'targetPortChanged') {
          updateProject((project) => {
            const model = project.models[project.selectedModelID];
            let from, to;
            if (event.entity.sourcePort.getName() === 'in') {
              from = event.entity.targetPort.parent;
              to = event.entity.sourcePort.parent;
            } else if (event.entity.sourcePort.getName() === 'out') {
              from = event.entity.sourcePort.parent;
              to = event.entity.targetPort.parent;
            } else {
              return project;
            }

            model.links[entity.getID()] = {
              id: entity.getID(),
              from: from.getBlockID() as string,
              to: to.getBlockID() as string,
            };
            return project;
          });
        } else if (event.function === 'entityRemoved') {
          updateProject((project) => {
            const model = project.models[project.selectedModelID];
            delete model.links[entity.getLinkID()];
            return project;
          });
        }
      } else if (entity instanceof DiagramModel) {
        if (event.function === 'offsetUpdated') {
          updateProject((project) => {
            const model = project.models[project.selectedModelID];
            model.diagramInfo.offset = {
              x: entity.getOffsetX(),
              y: entity.getOffsetY(),
            };
            return project;
          });
        } else if (event.function === 'zoomUpdated') {
          updateProject((project) => {
            const model = project.models[project.selectedModelID];
            model.diagramInfo.zoom = event.zoom;
            return project;
          });
        }
      }
    });
    return () => deregister();
  }, [engine, project, updateProject, setLastFunction, setLastBlockID, setLastPosition]);

  return (
    <div onMouseUp={handleMouseUp}>
      <CanvasWidget className={classes.canvas} engine={engine.getEngine()} />
    </div>
  );
}
