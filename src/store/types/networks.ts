// Metis
// Copyright 2021-present NAVER Corp.
// Apache License v2.0

import { v4 as uuidv4 } from 'uuid';
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

export type Dependencies = {
  [id: string]: Dependency;
};

export type AllDependencies = {
  builtInDeps?: Dependencies;
  thirdPartyDeps?: Dependencies;
  projectDeps?: Dependencies;
};

export type Network = {
  id: string;
  name: string;
  dependencies: AllDependencies;
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

export function createNetwork(name: string): Network {
  return {
    id: uuidv4(),
    name,
    dependencies: {
      thirdPartyDeps: {
        torch: {
          id: 'torch',
          name: 'torch',
        },
        torchNN: {
          id: 'torchNN',
          name: 'torch.nn',
          alias: 'nn',
        },
      },
    },
    blocks: {
      in: {
        id: 'in',
        name: 'in',
        type: BlockType.In,
        position: { x: 100, y: 100 },
        initVariables: '',
      },
      out: {
        id: 'out',
        name: 'out',
        type: BlockType.Out,
        position: { x: 100, y: 200 },
        initVariables: '',
      },
    },
    links: {},
  };
}
