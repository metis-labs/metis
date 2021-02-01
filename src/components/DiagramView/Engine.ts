import createEngine, { DiagramEngine, DiagramModel } from '@projectstorm/react-diagrams';

import { MetisNodeModel } from 'components/DiagramView/MetisNodeModel';
import { MetisNodeFactory } from 'components/DiagramView/MetisNodeFactory';
import { NetworkFragment, EmptyNetworkFragment } from 'store/types';
import { MetisLinkFactory } from './MetisLinkFactory';
import { MetisLinkModel } from './MetisLinkModel';

export class Engine {
  private engine: DiagramEngine;
  private previousFragment: NetworkFragment;

  constructor() {
    this.engine = createEngine();
    this.engine.maxNumberPointsPerLink = 0;
    this.engine.getNodeFactories().registerFactory(new MetisNodeFactory());
    this.engine.getLinkFactories().registerFactory(new MetisLinkFactory());
    this.engine.setModel(new DiagramModel());
    this.previousFragment = EmptyNetworkFragment;
  }

  update(fragment: NetworkFragment) {
    if (fragment.blocks === this.previousFragment.blocks && fragment.links === this.previousFragment.links) {
      return;
    }

    const diagramModel = new DiagramModel();
    const nodes = [];
    const nodeInfoMap: { [key: string]: MetisNodeModel } = {};

    if (fragment.diagramInfo.offset) {
      diagramModel.setOffset(fragment.diagramInfo.offset.x, fragment.diagramInfo.offset.y);
    }
    if (fragment.diagramInfo.zoom) {
      diagramModel.setZoomLevel(fragment.diagramInfo.zoom);
    }

    for (const [, block] of Object.entries(fragment.blocks)) {
      const node = new MetisNodeModel({
        blockType: block.type,
        name: block.name,
        blockID: block.id,
      });
      node.setPosition(block.position.x, block.position.y);
      nodes.push(node);

      nodeInfoMap[block.id] = node;
    }

    const links: Array<MetisLinkModel> = [];

    for (const [, link] of Object.entries(fragment.links)) {
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
    this.previousFragment = fragment;
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
