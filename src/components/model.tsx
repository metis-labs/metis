export const testModel = {
  blocks: [{
    id: 'test_input',
    name: 'test_input',
    type: 'input',
    defaultRepeat: 1,
    ports: [{id: 0, name: 'input'}],
    position: {
      x: 100,
      y: 100,
    }
  }, {
    id: 'test_output',
    name: 'test_output',
    type: 'output',
    defaultRepeat: 1,
    ports: [{id: 0, name: 'input'}],
    position: {
      x: 100,
      y: 500
    }
  }, {
    id: 'conv_1',
    name: 'conv_1',
    type: 'Conv2d',
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
    position: {
      x: 100,
      y: 200
    }
  }, {
    id: 'maxpool_1',
    name: 'maxpool_1',
    type: 'MaxPool2d',
    repeats: 1,
    kernelSize: 3,
    stride: 2,
    padding: 0,
    dilation: 1,
    position: {
      x: 100,
      y: 300
    }
  }, {
    id: 'relu',
    name: 'relu',
    type: 'ReLU',
    repeats: 1,
    inplace: true, // boolean
    position: {
      x: 100,
      y: 400
    }
  }],

  links: [{
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
  }],
}
