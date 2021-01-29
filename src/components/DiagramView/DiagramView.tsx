import React, { useState, useCallback, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { CanvasWidget } from '@projectstorm/react-canvas-core';

import { Engine } from 'components/DiagramView/Engine';
import {Link, Position } from 'store/types';
import { useFragment } from '../../index';
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

  const [fragment, updateFragment] = useFragment();
  const [engine] = useState(new Engine());
  const [lastFunction, setLastFunction] = useState<string>();
  const [lastBlockID, setLastBlockID] = useState<string>();
  const [lastPosition, setLastPosition] = useState<Position>();

  const handleMouseUp = useCallback(
    (event: any) => {
      if (lastFunction === 'selectionChanged' && lastBlockID) {
        updateFragment((fragment) => {
          fragment.selectedBlockID = lastBlockID;
          return fragment;
        });
      } else if (lastFunction === 'positionChanged' && lastBlockID) {
        updateFragment((fragment) => {
          fragment.blocks[lastBlockID].position = lastPosition;
          fragment.selectedBlockID = lastBlockID;
          return fragment;
        });
      }
    },
    [lastFunction, lastBlockID, lastPosition, updateFragment],
  );

  useEffect(() => {
    engine.update(fragment);
    const deregister = engine.registerListener((event: any, entity: any) => {
      setLastFunction(event.function);
      if (entity instanceof MetisNodeModel) {
        setLastBlockID(entity.getBlockID());
        if (event.function === 'positionChanged') {
          setLastPosition(event.entity.position);
        } else if (event.function === 'entityRemoved') {
          updateFragment((fragment) => {
            delete fragment.blocks[entity.getBlockID()];
            return fragment;
          });
        }
      } else if (entity instanceof MetisLinkModel) {
        if (event.function === 'targetPortChanged') {
          updateFragment((fragment) => {
            let from, to;
            if (event.entity.sourcePort.getName() === 'in') {
              from = event.entity.targetPort.parent;
              to = event.entity.sourcePort.parent;
            } else if (event.entity.sourcePort.getName() === 'out') {
              from = event.entity.sourcePort.parent;
              to = event.entity.targetPort.parent;
            } else {
              return fragment;
            }

            const link = {
              id: entity.getID(),
              from: from.getBlockID() as string,
              to: to.getBlockID() as string,
            } as Link;
            fragment.links[entity.getID()] = link;
            return fragment;
          });
        } else if (event.function === 'entityRemoved') {
          updateFragment((fragment) => {
            delete fragment.links[entity.getLinkID()];
            return fragment;
          });
        }
      } else if (entity instanceof DiagramModel) {
        if (event.function === 'offsetUpdated') {
          updateFragment((fragment) => {
            fragment.offset.x =  entity.getOffsetX();
            fragment.offset.y =  entity.getOffsetY();
            return fragment;
          });
        }
      }
    });
    return () => deregister();
  }, [engine, fragment, updateFragment, setLastFunction, setLastBlockID, setLastPosition]);

  return (
    <div onMouseUp={handleMouseUp}>
      <CanvasWidget className={classes.canvas} engine={engine.getEngine()} />
    </div>
  );
}
