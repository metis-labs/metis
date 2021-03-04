import createEngine, { DiagramEngine, DiagramModel } from '@projectstorm/react-diagrams';

import { MetisNodeModel } from 'components/DiagramView/MetisNodeModel';
import { MetisNodeFactory } from 'components/DiagramView/MetisNodeFactory';
import { Model, EmptyModel } from 'store/types';
import { MetisLinkFactory } from './MetisLinkFactory';
import { MetisLinkModel } from './MetisLinkModel';

export class Engine {
  private engine: DiagramEngine;
  private previousModel: Model;

  constructor() {
    this.engine = createEngine();
    this.engine.maxNumberPointsPerLink = 0;
    this.engine.getNodeFactories().registerFactory(new MetisNodeFactory());
    this.engine.getLinkFactories().registerFactory(new MetisLinkFactory());
    this.engine.setModel(new DiagramModel());
    this.previousModel = EmptyModel;
  }

  update(model: Model) {
    // TODO(youngteac.hong): If we got performance issues, we need to compare more strictly.
    const diagramModel = new DiagramModel();
    const nodes = [];
    const nodeInfoMap: { [key: string]: MetisNodeModel } = {};

    if (model.diagramInfo.offset) {
      diagramModel.setOffset(model.diagramInfo.offset.x, model.diagramInfo.offset.y);
    }
    if (model.diagramInfo.zoom) {
      diagramModel.setZoomLevel(model.diagramInfo.zoom);
    }

    for (const [, block] of Object.entries(model.blocks)) {
      const node = new MetisNodeModel({
        blockType: block.type,
        name: block.name,
        blockID: block.id,
        repeats: block.repeats,
      });
      node.setPosition(block.position.x, block.position.y);
      nodes.push(node);

      nodeInfoMap[block.id] = node;
    }

    const links: Array<MetisLinkModel> = [];

    for (const [, link] of Object.entries(model.links)) {
      if (!nodeInfoMap[link.from] || !nodeInfoMap[link.to]) {
        continue;
      }

      const outPort = nodeInfoMap[link.from].getOutPort();
      const inPort = nodeInfoMap[link.to].getInPort();
      const linkModel = outPort.link<MetisLinkModel>(inPort) as MetisLinkModel;
      linkModel.setLinkID(link.id);
      links.push(linkModel);
    }

    diagramModel.addAll(...nodes, ...links);
    this.engine.setModel(diagramModel);
    this.previousModel = model;
  }

  public getEngine(): DiagramEngine {
    return this.engine;
  }

  public registerListener(listener: Function): Function {
    const deregisters = [];

    const listeners = {
      eventDidFire: (event: any) => {
        listener(event, event.entity);
      },
    };

    const handle = this.engine.getModel().registerListener({
      eventDidFire: (event: any) => {
        if (event.function === 'linksUpdated' && event.isCreated && event.link) {
          const handle = event.link.registerListener(listeners);
          deregisters.push(handle.deregister);
        }
        listener(event, event.entity);
      },
    });
    deregisters.push(handle.deregister);

    for (const node of this.engine.getModel().getModels()) {
      const handle = node.registerListener(listeners);
      deregisters.push(handle.deregister);
    }

    return () => {
      for (const deregister of deregisters) {
        deregister();
      }
    };
  }
}
