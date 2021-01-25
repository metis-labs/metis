import {Block, BlockType, NetworkFragment} from "./model";

const blocks = [
  new Block(
    'test_input',
    'test_input',
    BlockType.In,
    {x: 100, y: 100},
  ), new Block(
    'test_output',
    'test_output',
    BlockType.Out,
    {x: 100,  y: 500},
  ), new Block(
    'conv_1',
    'conv_1',
    BlockType.Conv2d,
    {x: 100, y: 200},
    {
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
    }
  ), new Block(
    'maxpool_1',
    'maxpool_1',
    BlockType.MaxPool2d,
    {x: 100, y: 300},
    {
      repeats: 1,
      kernelSize: 3,
      stride: 2,
      padding: 0,
      dilation: 1,
    }), new Block (
    'relu',
    'relu',
    BlockType.ReLU,
    {x: 100, y: 400},
    {
      repeats: 1,
      inplace: true, // boolean
    })
];

const links = [{
  from: 'test_input',
  to: 'conv_1'
}, {
  from: 'conv_1',
  to: 'maxpool_1',
}, {
  from: 'maxpool_1',
  to: 'relu',
}, {
  from: 'relu',
  to: 'test_output'
}]

const testFragment = new NetworkFragment();
for (const block of blocks) {
  testFragment.addBlock(block);
}
for (const link of links) {
  testFragment.addLink(link);
}

export default testFragment;