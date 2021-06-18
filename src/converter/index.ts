import { Project } from 'features/projectSlice';
import { BlockType, NetworkBlock } from 'store/types/blocks';
import { Network } from 'store/types/networks';
import ImportConverter from './importConverter';
import InitConverter from './initConverter';
import ForwardConverter from './forwardConverter';
import CreateGraph, { IncomingDegree } from './utils';

export default class Converter {
  private result: string;

  update(project: Project, selectedNetworkID: string): void {
    this.result = '';

    // TODO(genesis.kim): need a specific method to handle the data structure
    const network = JSON.parse(JSON.stringify(project.networks[selectedNetworkID])) as Network;

    // Update Dependencies
    let projectDeps: string[] = [];
    (Object.values(network.blocks).filter((block) => block.type === BlockType.Network) as NetworkBlock[]).map((block) =>
      block.refNetwork ? projectDeps.push(project.networks[block.refNetwork].name) : '',
    );
    projectDeps = projectDeps.filter((v, i) => projectDeps.indexOf(v) === i);
    network.dependencies.projectDeps = {};
    projectDeps.forEach((projectDep) => {
      network.dependencies.projectDeps[projectDep] = {
        id: projectDep,
        name: projectDep,
        package: projectDep,
      };
    });

    const { graph, nonPartBlocks } = CreateGraph(network.links, network.blocks);
    const topologicalIndice = IncomingDegree(graph);

    const importConverter = new ImportConverter();
    importConverter.update(network.dependencies);

    const initConverter = new InitConverter();
    initConverter.orderBlocks(network.blocks);
    initConverter.updateHeader(network);
    initConverter.updateBody(project, network.blocks, topologicalIndice, nonPartBlocks);

    const fowardConverter = new ForwardConverter();
    fowardConverter.updateHeader(network.links, network.blocks);
    fowardConverter.updateBody(network.blocks, graph, topologicalIndice);

    this.result += importConverter.getResult();
    this.result += initConverter.getResult();
    this.result += fowardConverter.getResult();
  }

  getResult(): string {
    return this.result;
  }
}
