import { EmptyNetwork, Network } from '../store/types/networks';
import { Project } from '../store/types';
import ImportConverter from './importConverter';
import InitConverter from './initConverter';
import ForwardConverter from './forwardConverter';

export default class Converter {
  private previousNetwork: Network;

  private codeString: string;

  constructor() {
    this.previousNetwork = EmptyNetwork;
    this.codeString = '';
  }

  update(project: Project, selectedNetworkID: string): void {
    const network = project.networks[selectedNetworkID] as Network;
    if (
      network.dependencies === this.previousNetwork.dependencies &&
      network.blocks === this.previousNetwork.blocks &&
      network.links === this.previousNetwork.links
    ) {
      return;
    }

    this.codeString = '';

    const importTemplate = new ImportConverter();
    importTemplate.update(network.dependencies);

    const initTemplate = new InitConverter();
    initTemplate.orderedBlockList(network.blocks);
    initTemplate.updateInitFront(network);
    initTemplate.updateInitBody(project, network.blocks);

    const forwardTemplate = new ForwardConverter();
    forwardTemplate.updateForwardFront(network.links, network.blocks);
    forwardTemplate.updateForwardBody(network.blocks);

    this.codeString += importTemplate.getResult();
    this.codeString += initTemplate.getResult();
    this.codeString += forwardTemplate.getResult();

    this.previousNetwork = network;
  }

  getResult(): string {
    return this.codeString;
  }
}
