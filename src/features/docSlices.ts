import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import anonymous from 'anonymous-animals-gen';
import yorkie, { Client, DocumentReplica } from 'yorkie-js-sdk';
import randomColor from 'randomcolor';
import { Project } from 'store/types';
import { createNetworkParams, Network } from 'store/types/networks';
import { encodeEventDesc } from 'store/types/events';
import { Position } from 'store/types/base';
import { Block, BlockType, createBlock, createParams, isNormalBlockType } from 'store/types/blocks';
import { valueTransition } from 'components/PropertyBar/utils';
import { PeerInfoState } from './peerInfoSlices';

export type MetisDoc = {
  project: Project;
  peers: PeerInfoState;
};
export enum DocStatus {
  Disconnect = 'disconnect',
  Connect = 'connect',
}

export interface DocState {
  client?: Client;
  doc?: DocumentReplica<MetisDoc>;
  loading: boolean;
  errorMessage: string;
  status: DocStatus;
  repaintingCounter: number;
}

const initialDocState: DocState = {
  loading: true,
  errorMessage: '',
  status: DocStatus.Connect,
  repaintingCounter: 0,
};

const testUserID = 'KR18401';

export const activateClient = createAsyncThunk<ActivateClientResult, undefined, { rejectValue: string }>(
  'doc/activate',
  async (_: undefined, thunkApi) => {
    try {
      const { name, animal } = anonymous.generate();
      const client = yorkie.createClient(`${process.env.REACT_APP_YORKIE_RPC_ADDR}`, {
        token: testUserID,
        metadata: {
          username: name,
          image: animal,
          color: randomColor(),
        },
      });

      await client.activate();
      return { client };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  },
);

export const attachDoc = createAsyncThunk<AttachDocResult, AttachDocArgs, { rejectValue: string }>(
  'doc/attach',
  async ({ client, doc }, thunkApi) => {
    try {
      await client.attach(doc);

      doc.update((root) => {
        if (!root.peers) {
          root.peers = {} as PeerInfoState;
        }
        const networkIDs = Object.keys(root.project.networks);
        if (!root.peers[client.getID()]) {
          root.peers[client.getID()] = {
            selectedNetworkID: networkIDs[0],
          };
        }
      });

      await client.sync();

      return { doc, client };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  },
);

export const updateSelectedNetworkID = createAsyncThunk<
  UpdateNetworkIDResult,
  UpdateNetworkIDArgs,
  { rejectValue: string }
>('doc/peersSelectedNetwork', async ({ client, doc, networkID }, thunkApi) => {
  try {
    const clientID = client.getID();
    doc.update((root) => {
      root.peers[clientID].selectedNetworkID = networkID;
    });
    return { doc };
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const updateCreatedNetwork = createAsyncThunk<
  UpdateCreatedNetworkResult,
  UpdateCreatedNetworkArgs,
  { rejectValue: string }
>('doc/updateCreatedNetwork', async ({ doc, network }, thunkApi) => {
  try {
    doc.update(
      (root) => {
        root.project.networks[network.id] = network;
      },
      encodeEventDesc({
        id: network.id,
        entityType: 'network',
        actionType: 'create',
      }),
    );
    return { doc };
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const updateRenamedNetwork = createAsyncThunk<
  UpdateRenamedNetworkResult,
  UpdateRenamedNetworkArgs,
  { rejectValue: string }
>('doc/updateRenamedNetwork', async ({ doc, network, modelName }, thunkApi) => {
  try {
    doc.update((root) => {
      root.project.networks[network.id].name = modelName;
    });
    return { doc };
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const updateDeletedNetwork = createAsyncThunk<
  UpdateDeletedNetworkResult,
  UpdateDeletedNetworkArgs,
  { rejectValue: string }
>('doc/updateDeletedNetwork', async ({ doc, network }, thunkApi) => {
  try {
    doc.update(
      (root) => {
        delete root.project.networks[network.id];
      },
      encodeEventDesc({
        id: network.id,
        entityType: 'network',
        actionType: 'delete',
      }),
    );
    return { doc };
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const updatePortChange = createAsyncThunk<UpdatePortChangeResult, UpdatePortChangeArgs, { rejectValue: string }>(
  'doc/updatePortChange',
  async ({ doc, networkID, event }, thunkApi) => {
    try {
      doc.update((root) => {
        const network = root.project.networks[networkID];
        let from;
        let to;
        if (event.entity.sourcePort.getName() === 'in') {
          from = event.entity.targetPort.parent;
          to = event.entity.sourcePort.parent;
        } else if (event.entity.sourcePort.getName() === 'out') {
          from = event.entity.sourcePort.parent;
          to = event.entity.targetPort.parent;
        } else {
          return;
        }
        network.links[event.entity.getID()] = {
          id: event.enitity.getID(),
          from: from.getBlockID(),
          to: to.getBlockID(),
        };
      });
      return { doc };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  },
);

export const updateAddedBlock = createAsyncThunk<UpdateAddedBlockResult, UpdateAddedBlockArgs, { rejectValue: string }>(
  'doc/updateAddedBlock',
  async ({ doc, networkID, type, diagramOffset }, thunkApi) => {
    try {
      doc.update((root) => {
        const network = root.project.networks[networkID];
        const blockLength = Object.values(network.blocks).filter((block: Block) => block.type === type).length;
        const position = { x: 200 + 10 * blockLength - diagramOffset.x, y: 200 + 10 * blockLength - diagramOffset.y };
        const block = createBlock(type, position, blockLength);
        network.blocks[block.id] = block;
      });
      return { doc };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  },
);

export const updateDeletedBlock = createAsyncThunk<
  UpdateDeletedBlockResult,
  UpdateDeletedBlockArgs,
  { rejectValue: string }
>('doc/updateDeletedBlock', async ({ doc, networkID, blockID }, thunkApi) => {
  try {
    doc.update((root) => {
      const network = root.project.networks[networkID];
      delete network.blocks[blockID];
    });
    return { doc };
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const updateDeletedLink = createAsyncThunk<
  UpdateDeletedLinkResult,
  UpdateDeletedLinkArgs,
  { rejectValue: string }
>('doc/updateDeletedLink', async ({ doc, networkID, linkID }, thunkApi) => {
  try {
    doc.update((root) => {
      const network = root.project.networks[networkID];
      if (network.links[linkID]) {
        delete network.blocks[linkID];
      }
    });
    return { doc };
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const updateBlockPosition = createAsyncThunk<
  UpdateBlockPositionResult,
  UpdateBlockPositionArgs,
  { rejectValue: string }
>('doc/updateBlockPosition', async ({ doc, networkID, blockID, position }, thunkApi) => {
  try {
    doc.update((root) => {
      const model = root.project.networks[networkID];
      model.blocks[blockID].position = position;
    });
    return { doc };
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const updateCursorPosition = createAsyncThunk<
  UpdateCursorPositionResult,
  UpdateCursorPositionArgs,
  { rejectValue: string }
>('doc/updateCursorPosition', async ({ doc, clientID, position }, thunkApi) => {
  try {
    doc.update((root) => {
      root.peers[clientID].cursor = position;
    });
    return { doc };
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export const changeBlockType = createAsyncThunk<ChangeBlockTypeResult, ChangeBlockTypeArgs, { rejectValue: string }>(
  'doc/changeBlockType',
  async ({ doc, event, selectedNetworkID, selectedBlockID }, thunkApi) => {
    try {
      doc.update((root) => {
        const { project } = root;
        const model = project.networks[selectedNetworkID];
        const type = event.target.value as BlockType;
        model.blocks[selectedBlockID].type = type;
        if (isNormalBlockType(type)) {
          (model.blocks[selectedBlockID] as any).parameters = createParams(type);
        } else {
          (model.blocks[selectedBlockID] as any).parameters = {};
        }
      });
      return { doc };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  },
);

export const changeRefNetwork = createAsyncThunk<ChangeRefNetworkResult, ChangeRefNetworkArgs, { rejectValue: string }>(
  'doc/changeRefNetwork',
  async ({ doc, event, selectedNetworkID, selectedBlockID }, thunkApi) => {
    try {
      doc.update((root) => {
        const networkName = event.target.value;
        const project = root.project as Project;
        const network = project.networks[selectedNetworkID];

        // Update network block
        const targetNetwork = Object.values(project.networks).find((network) => network.name === networkName);
        const block = network.blocks[selectedBlockID];
        if (block.type === BlockType.Network) {
          block.refNetwork = targetNetwork ? targetNetwork.id : '';
          block.parameters = targetNetwork ? createNetworkParams(targetNetwork) : {};
        }
      });
      return { doc };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  },
);

export const changeProperty = createAsyncThunk<ChangePropertyResult, ChangePropertyArgs, { rejectValue: string }>(
  'doc/changeProperty',
  async ({ doc, event, selectedNetworkID, selectedBlockID, key }, thunkApi) => {
    try {
      doc.update((root) => {
        const { project } = root;
        const model = project.networks[selectedNetworkID];
        model.blocks[selectedBlockID][key] = valueTransition(event.target.value as string);
      });
      return { doc };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  },
);

export const changePrameter = createAsyncThunk<ChangePrameterResult, ChangePrameterArgs, { rejectValue: string }>(
  'doc/changePrameter',
  async ({ doc, event, selectedNetworkID, selectedBlockID, key }, thunkApi) => {
    try {
      doc.update((root) => {
        const { project } = root;
        const model = project.networks[selectedNetworkID];
        (model.blocks[selectedBlockID] as any).parameters[key] = valueTransition(event.target.value as string);
      });
      return { doc };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  },
);

const docSlice = createSlice({
  name: 'doc',
  initialState: initialDocState,
  reducers: {
    deactivateClient(state) {
      const { client } = state;
      state.client = undefined;
      client.deactivate();
    },
    createDocument(state, action: PayloadAction<string>) {
      state.doc = yorkie.createDocument<MetisDoc>('projects', action.payload);
    },
    detachDocument(state) {
      const { doc, client } = state;
      state.doc = undefined;
      client.detach(doc as DocumentReplica<MetisDoc>);
    },
    attachDocLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setStatus(state, action: PayloadAction<DocStatus>) {
      state.status = action.payload;
    },
    setRepaintCounter(state, action: PayloadAction<number>) {
      state.repaintingCounter += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(activateClient.fulfilled, (state, { payload }) => {
      state.client = payload.client;
    });
    builder.addCase(activateClient.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(attachDoc.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
      state.client = payload.client;
    });
    builder.addCase(attachDoc.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(updateSelectedNetworkID.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
    });
    builder.addCase(updateSelectedNetworkID.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(updateCreatedNetwork.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
    });
    builder.addCase(updateCreatedNetwork.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(updateRenamedNetwork.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
    });
    builder.addCase(updateRenamedNetwork.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(updateDeletedNetwork.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
    });
    builder.addCase(updateDeletedNetwork.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(updatePortChange.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
    });
    builder.addCase(updatePortChange.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(updateAddedBlock.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
    });
    builder.addCase(updateAddedBlock.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(updateDeletedBlock.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
    });
    builder.addCase(updateDeletedBlock.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(updateDeletedLink.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
    });
    builder.addCase(updateDeletedLink.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(updateBlockPosition.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
    });
    builder.addCase(updateBlockPosition.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(updateCursorPosition.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
    });
    builder.addCase(updateCursorPosition.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(changeBlockType.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
    });
    builder.addCase(changeBlockType.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(changeRefNetwork.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
    });
    builder.addCase(changeRefNetwork.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(changeProperty.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
    });
    builder.addCase(changeProperty.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(changePrameter.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
    });
    builder.addCase(changePrameter.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
  },
});

export const { deactivateClient, createDocument, detachDocument, attachDocLoading, setStatus, setRepaintCounter } =
  docSlice.actions;
export default docSlice.reducer;

type ActivateClientResult = { client: Client };
type AttachDocArgs = { doc: DocumentReplica<MetisDoc>; client: Client };
type AttachDocResult = { doc: DocumentReplica<MetisDoc>; client: Client };
type UpdateNetworkIDArgs = { doc: DocumentReplica<MetisDoc>; client: Client; networkID: string };
type UpdateNetworkIDResult = { doc: DocumentReplica<MetisDoc> };
type UpdateCreatedNetworkArgs = { doc: DocumentReplica<MetisDoc>; client: Client; network: Network };
type UpdateCreatedNetworkResult = { doc: DocumentReplica<MetisDoc> };
type UpdateRenamedNetworkArgs = { doc: DocumentReplica<MetisDoc>; network: Network; modelName: string };
type UpdateRenamedNetworkResult = { doc: DocumentReplica<MetisDoc> };
type UpdateDeletedNetworkArgs = { doc: DocumentReplica<MetisDoc>; network: Network };
type UpdateDeletedNetworkResult = { doc: DocumentReplica<MetisDoc> };
type UpdatePortChangeArgs = { doc: DocumentReplica<MetisDoc>; networkID: string; event: any };
type UpdatePortChangeResult = { doc: DocumentReplica<MetisDoc> };
type UpdateAddedBlockArgs = {
  doc: DocumentReplica<MetisDoc>;
  networkID: string;
  type: BlockType;
  diagramOffset: Position;
};
type UpdateAddedBlockResult = { doc: DocumentReplica<MetisDoc> };
type UpdateDeletedBlockArgs = { doc: DocumentReplica<MetisDoc>; networkID: string; blockID: string };
type UpdateDeletedBlockResult = { doc: DocumentReplica<MetisDoc> };
type UpdateDeletedLinkArgs = { doc: DocumentReplica<MetisDoc>; networkID: string; linkID: string };
type UpdateDeletedLinkResult = { doc: DocumentReplica<MetisDoc> };
type UpdateBlockPositionArgs = {
  doc: DocumentReplica<MetisDoc>;
  networkID: string;
  blockID: string;
  position: Position;
};
type UpdateBlockPositionResult = { doc: DocumentReplica<MetisDoc> };
type UpdateCursorPositionArgs = { doc: DocumentReplica<MetisDoc>; clientID: string; position: Position };
type UpdateCursorPositionResult = { doc: DocumentReplica<MetisDoc> };

type ChangeRefNetworkArgs = {
  doc: DocumentReplica<MetisDoc>;
  event: any;
  selectedNetworkID: string;
  selectedBlockID: string;
};
type ChangeRefNetworkResult = { doc: DocumentReplica<MetisDoc> };
type ChangeBlockTypeArgs = {
  doc: DocumentReplica<MetisDoc>;
  event: any;
  selectedNetworkID: string;
  selectedBlockID: string;
};
type ChangeBlockTypeResult = { doc: DocumentReplica<MetisDoc> };
type ChangePropertyArgs = {
  doc: DocumentReplica<MetisDoc>;
  event: any;
  selectedNetworkID: string;
  selectedBlockID: string;
  key: string;
};
type ChangePropertyResult = { doc: DocumentReplica<MetisDoc> };
type ChangePrameterArgs = {
  doc: DocumentReplica<MetisDoc>;
  event: any;
  selectedNetworkID: string;
  selectedBlockID: string;
  key: string;
};
type ChangePrameterResult = { doc: DocumentReplica<MetisDoc> };
