import { Project } from 'features/projectSlice';
import { BlockType, NetworkBlock } from 'store/types/blocks';
import { Network } from 'store/types/networks';
import ImportConverter from './importConverter';
import InitConverter from './initConverter';
import ForwardConverter from './forwardConverter';

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

    const importConverter = new ImportConverter();
    importConverter.update(network.dependencies);

    const initConverter = new InitConverter();
    initConverter.orderBlocks(network.blocks);
    initConverter.updateSignature(network);
    initConverter.updateBody(project, network.blocks);

    const fowardConverter = new ForwardConverter();
    fowardConverter.updateSignature(network.links, network.blocks);
    fowardConverter.updateBody(network.blocks);

    this.result += importConverter.getResult();
    this.result += initConverter.getResult();
    this.result += fowardConverter.getResult();
  }

  getResult(): string {
    return this.result;
  }
}
