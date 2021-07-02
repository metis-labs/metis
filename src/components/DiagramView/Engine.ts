// Metis
// Copyright 2021-present NAVER Corp.
// Apache License v2.0

import createEngine, { DiagramEngine, DiagramModel } from '@projectstorm/react-diagrams';

import { DiagramInfo } from 'features/localSlice';
import { Network } from 'store/types/networks';
import { isIOBlockType, BlockType } from 'store/types/blocks';
import MetisNodeModel from 'components/DiagramView/MetisNodeModel';
import MetisNodeFactory from 'components/DiagramView/MetisNodeFactory';
import MetisLinkModel from './MetisLinkModel';
import MetisLinkFactory from './MetisLinkFactory';

export default class Engine {
  private engine: DiagramEngine;

  constructor() {
    this.engine = createEngine();
    this.engine.maxNumberPointsPerLink = 0;
    this.engine.getNodeFactories().registerFactory(new MetisNodeFactory());
    this.engine.getLinkFactories().registerFactory(new MetisLinkFactory());
    this.engine.setModel(new DiagramModel());
  }

  update(network: Network, networks: { [networkID: string]: Network }, diagramInfo: DiagramInfo) {
    // TODO(youngteac.hong): If we got performance issues, we need to compare more strictly.
    const diagramModel = new DiagramModel();
    const nodes = [];
    const nodeInfoMap: { [key: string]: MetisNodeModel } = {};

    if (diagramInfo.offset) {
      diagramModel.setOffset(diagramInfo.offset.x, diagramInfo.offset.y);
    }
    if (diagramInfo.zoom) {
      diagramModel.setZoomLevel(diagramInfo.zoom);
    }

    for (const [, block] of Object.entries(network.blocks)) {
      let repeats = 0;
      if (!isIOBlockType(block.type)) {
        // @ts-ignore
        repeats = block.repeats;
      }

      let refNetworkName = '';
      if (block.type === BlockType.Network) {
        refNetworkName = block.refNetwork ? networks[block.refNetwork].name : BlockType.Network;
      }

      const node = new MetisNodeModel({
        blockType: block.type,
        name: block.name,
        blockID: block.id,
        repeats,
        refNetworkName,
      });
      node.setPosition(block.position.x, block.position.y);
      nodes.push(node);

      nodeInfoMap[block.id] = node;
    }

    const links: Array<MetisLinkModel> = [];

    for (const link of Object.values(network.links)) {
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
      doubleClicked: (event: any) => {
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
