import { Block, BlockType, Link, NetworkFragment } from './store';

const blocks: { [id: string]: Block } = {
  test_input: {
    id: 'test_input',
    name: 'test_input',
    type: BlockType.In,
    position: { x: 100, y: 100 },
  },
  test_output: {
    id: 'test_output',
    name: 'test_output',
    type: BlockType.Out,
    position: { x: 100, y: 500 },
  },
  conv_1: {
    id: 'conv_1',
    name: 'conv_1',
    type: BlockType.Conv2d,
    position: { x: 100, y: 200 },
    properties: {
      repeats: 1,
      inChannel: 3,
      outChannel: 1,
      kernelSize: 3,
      stride: 1,
      padding: 0,
      paddingMode: 'zeros', // categorical
      dilation: 1,
      groups: 1,
      base: false, // boolean
    },
  },
  maxpool_1: {
    id: 'maxpool_1',
    name: 'maxpool_1',
    type: BlockType.MaxPool2d,
    position: { x: 100, y: 300 },
    properties: {
      repeats: 1,
      kernelSize: 3,
      stride: 2,
      padding: 0,
      dilation: 1,
    },
  },
  relu: {
    id: 'relu',
    name: 'relu',
    type: BlockType.ReLU,
    position: { x: 100, y: 400 },
    properties: {
      repeats: 1,
      inplace: true, // boolean
    },
  },
};

const links: Link[] = [
  {
    from: 'test_input',
    to: 'conv_1',
  },
  {
    from: 'conv_1',
    to: 'maxpool_1',
  },
  {
    from: 'maxpool_1',
    to: 'relu',
  },
  {
    from: 'relu',
    to: 'test_output',
  },
];

const testFragment = {
  blocks,
  links,
} as NetworkFragment;

export default testFragment;
