import * as SRD from "@projectstorm/react-diagrams";

import {MetisNodeModel} from "components/DiagramView/MetisNodeModel";
import {MetisNodeFactory} from "components/DiagramView/MetisNodeFactory";
import {NetworkFragment} from "store/store";

export class DiagramEngine {
  protected activeModel: SRD.DiagramModel;
  protected diagramEngine: SRD.DiagramEngine;

  constructor() {
    this.diagramEngine = SRD.default();
    this.diagramEngine.getNodeFactories().registerFactory(new MetisNodeFactory());
    this.activeModel = new SRD.DiagramModel();
    this.diagramEngine.setModel(this.activeModel);
  }

  update(fragment: NetworkFragment) {
    this.activeModel = new SRD.DiagramModel();
    const nodes = [];
    const nodeInfoMap: {[key: string]: MetisNodeModel} = {};

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

    const links: Array<SRD.DefaultLinkModel> = [];

    for (const link of fragment.links) {
      const outPort = nodeInfoMap[link.from].getOutPort();
      const inPort = nodeInfoMap[link.to].getInPort();
      links.push(outPort.link<SRD.DefaultLinkModel>(inPort));
    }

    this.activeModel.addAll(...nodes, ...links);
    this.diagramEngine.setModel(this.activeModel);
  }

  public getDiagramEngine(): SRD.DiagramEngine {
    return this.diagramEngine;
  }

  public registerListener(listener: Function): Function {
    const deregisters = [];

    const listeners = {
      eventDidFire: (event: any) => {
        listener(event, event.entity);
      }
    };

    const handle = this.diagramEngine.getModel().registerListener({
      eventDidFire: (event: any) => {
        if (event.function === 'linksUpdated' && event.isCreated && event.link) {
          const handle = event.link.registerListener(listeners);
          deregisters.push(handle.deregister);
        }
      }
    });
    deregisters.push(handle.deregister);

    for (const node of this.diagramEngine.getModel().getModels()) {
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
