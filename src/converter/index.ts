import { Project } from 'store/types';
import { BlockType, NetworkBlock } from 'store/types/blocks';
import ImportConverter from './importConverter';
import InitConverter from './initConverter';
import ForwardConverter from './forwardConverter';

export default class Converter {
  private result: string;

  update(project: Project, selectedNetworkID: string): void {
    this.result = '';

    const network = project.networks[selectedNetworkID];

    const refNetBlockList = [];
    (Object.values(network.blocks).filter((block) => block.type === BlockType.Network) as NetworkBlock[]).map((block) =>
      block.refNetwork ? refNetBlockList.push(project.networks[block.refNetwork].name) : '',
    );
    refNetBlockList.push.apply(refNetBlockList, ['torch', 'torchNN']);
    const notInRefs = Object.keys(network.dependencies).filter((dep) => !refNetBlockList.includes(dep));
    notInRefs.map((notInRef) => delete network.dependencies[notInRef]);
    refNetBlockList
      .filter((refNetBlock) => !Object.keys(network.dependencies).includes(refNetBlock))
      .forEach((inRef) => {
        network.dependencies[inRef] = {
          id: inRef,
          name: inRef,
          package: inRef,
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
