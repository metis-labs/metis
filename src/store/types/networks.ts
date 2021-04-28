import { Block, IOBlock, BlockType, Parameters } from './blocks';

export type Link = {
  id: string;
  from: string;
  to: string;
};

export type Dependency = {
  id: string;
  name: string;
  alias?: string;
  package?: string;
};

export type Network = {
  id: string;
  name: string;
  dependencies: { [id: string]: Dependency };
  blocks: { [id: string]: Block };
  links: { [id: string]: Link };
};

export function createNetworkParams(network: Network): Parameters {
  const parameters = {};
  for (const block of Object.values(network.blocks)) {
    if (block.type === BlockType.In) {
      const ioBlock = block as IOBlock;
      if (!ioBlock.initVariables) {
        continue;
      }
      for (const variable of ioBlock.initVariables.split(',')) {
        parameters[variable] = '';
      }
    }
  }
  return parameters;
}
