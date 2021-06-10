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

    const network = JSON.parse(JSON.stringify(project.networks[selectedNetworkID])) as Network;

    // Update Dependencies
    const refNetworkBlockNameList = [];
    (Object.values(network.blocks).filter((block) => block.type === BlockType.Network) as NetworkBlock[]).map((block) =>
      block.refNetwork ? refNetworkBlockNameList.push(project.networks[block.refNetwork].name) : '',
    );
    refNetworkBlockNameList.push.apply(refNetworkBlockNameList, ['torch', 'torchNN']);

    const noNeedDeps = Object.keys(network.dependencies).filter((dep) => !refNetworkBlockNameList.includes(dep));
    noNeedDeps.map((noNeedDep) => delete network.dependencies[noNeedDep]);
    refNetworkBlockNameList
      .filter((refNetBlockName) => !Object.keys(network.dependencies).includes(refNetBlockName))
      .forEach((includingRef) => {
        network.dependencies[includingRef] = {
          id: includingRef,
          name: includingRef,
          package: includingRef,
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
