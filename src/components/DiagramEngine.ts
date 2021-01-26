import * as SRD from "@projectstorm/react-diagrams";

import {MetisNodeModel} from "components/DiagramView/MetisNodeModel";
import {MetisNodeFactory} from "components/DiagramView/MetisNodeFactory";
import {NetworkFragment} from "model/model";

export class DiagramEngine {
  protected activeModel!: SRD.DiagramModel;
  protected diagramEngine: SRD.DiagramEngine;
  protected modelKeyMap: {[key: string]: string};
  protected fragment: NetworkFragment;

  constructor(fragment: NetworkFragment) {
    this.diagramEngine = SRD.default();
    this.diagramEngine.getNodeFactories().registerFactory(new MetisNodeFactory());
    this.modelKeyMap = {};
    this.fragment = fragment;
    this.newModel();
  }

  public newModel() {
    this.activeModel = new SRD.DiagramModel();
    this.diagramEngine.setModel(this.activeModel);

    const nodes = [];
    const nodeInfoMap: {[key: string]: MetisNodeModel} = {};

    for (const block of this.fragment.getBlocks()) {
      const node = new MetisNodeModel({
        blockType: block.getType(),
        name: block.getName()
      });
      node.setPosition(block.getPosition().x, block.getPosition().y);
      nodes.push(node);

      nodeInfoMap[block.getID()] = node;
      this.modelKeyMap[node.getID()] = block.getID();
    }

    const links: Array<SRD.DefaultLinkModel> = [];

    for (const link of this.fragment.getLinks() ) {
      const outPort = nodeInfoMap[link.from].getOutPort();
      const inPort = nodeInfoMap[link.to].getInPort();
      links.push(outPort.link<SRD.DefaultLinkModel>(inPort));
    }

    this.activeModel.addAll(...nodes, ...links);
  }

  public getActiveDiagram(): SRD.DiagramModel {
    return this.activeModel;
  }

  public getDiagramEngine(): SRD.DiagramEngine {
    return this.diagramEngine;
  }

  public addNode(): number {
    return this.getDiagramEngine().getModel().getNodes().length;
  }

  public registerListener(listener: Function): Function {
    const deregisters = [];
    for (const node of this.getDiagramEngine().getModel().getNodes()) {
      const handle = node.registerListener({
        eventDidFire: (event: any) => {
          const blockId = this.modelKeyMap[event.entity.getID()];
          const block = this.fragment.getBlock(blockId);
          listener(event, block);
        }
      });
      deregisters.push(handle.deregister);
    }
    return () => {
      for (const deregister of deregisters) {
          deregister();
      }
    };
  }
}
