import createEngine, { DefaultLinkModel, DiagramEngine, DiagramModel } from '@projectstorm/react-diagrams';

import { MetisNodeModel } from 'components/DiagramView/MetisNodeModel';
import { MetisNodeFactory } from 'components/DiagramView/MetisNodeFactory';
import { NetworkFragment } from 'store/types';

export class Engine {
  protected engine: DiagramEngine;

  constructor() {
    this.engine = createEngine();
    this.engine.getNodeFactories().registerFactory(new MetisNodeFactory());
    this.engine.setModel(new DiagramModel());
  }

  update(fragment: NetworkFragment) {
    const diagramModel = new DiagramModel();
    const nodes = [];
    const nodeInfoMap: { [key: string]: MetisNodeModel } = {};

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

    const links: Array<DefaultLinkModel> = [];

    for (const link of fragment.links) {
      const outPort = nodeInfoMap[link.from].getOutPort();
      const inPort = nodeInfoMap[link.to].getInPort();
      links.push(outPort.link<DefaultLinkModel>(inPort));
    }

    diagramModel.addAll(...nodes, ...links);
    this.engine.setModel(diagramModel);
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
