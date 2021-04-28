import { Project } from 'store/types';
import ImportConverter from './importConverter';
import InitConverter from './initConverter';
import ForwardConverter from './forwardConverter';

export default class Converter {
  private result: string;

  update(project: Project, selectedNetworkID: string): void {
    this.result = '';

    const network = project.networks[selectedNetworkID];

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
