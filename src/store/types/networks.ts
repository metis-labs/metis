import { Block } from './blocks';

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

export const EmptyNetwork = {
  id: '',
  name: '',
  diagramInfo: {},
  dependencies: {},
  blocks: {},
  links: {},
};
