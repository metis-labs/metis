// Metis
// Copyright 2021-present NAVER Corp.
// Apache License v2.0

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import yorkie, { Client, DocumentReplica } from 'yorkie-js-sdk';
import anonymous from 'anonymous-animals-gen';
import randomColor from 'randomcolor';

import { createNetwork, createNetworkParams, Network } from 'store/types/networks';
import { Block, BlockType, createBlock, createParams, isNormalBlockType } from 'store/types/blocks';
import { valueTransition } from 'components/PropertyBar/utils';
import { Project } from './projectSlice';
import { Peer, Position } from './peersSlice';

export type MetisDoc = {
  project: Project;
  peers: { [id: string]: Peer };
};

export enum DocStatus {
  Attached = 'attached',
  Detached = 'detached',
}

export interface DocState {
  client?: Client;
  doc?: DocumentReplica<MetisDoc>;
  loading: boolean;
  errorMessage: string;
  status: DocStatus;
}

const initialDocState: DocState = {
  loading: true,
  errorMessage: '',
  status: DocStatus.Detached,
};

type EntityType = 'network';
type ActionType = 'create' | 'delete';

type EventDesc = {
  id: string;
  entityType: EntityType;
  actionType: ActionType;
};

function encodeEventDesc(desc: EventDesc): string {
  return JSON.stringify(desc);
}

export function decodeEventDesc(desc: string): EventDesc {
  return JSON.parse(desc);
}

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

export const deactivateClient = createAsyncThunk<DeactivateClientResult, DeactivateClientArgs, { rejectValue: string }>(
  'doc/deactivate',
  async ({ client }, thunkApi) => {
    try {
      await client.deactivate();
      client = undefined;
      return { client };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  },
);

export const attachDocument = createAsyncThunk<AttachDocResult, AttachDocArgs, { rejectValue: string }>(
  'doc/attach',
  async ({ client, doc }, thunkApi) => {
    try {
      await client.attach(doc);
      doc.update((root) => {
        if (!root.peers) {
          root.peers = {};
        }
      });
      await client.sync();
      return { doc };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  },
);

export const detachDocument = createAsyncThunk<DetachDocResult, DetachDocArgs, { rejectValue: string }>(
  'doc/detach',
  async ({ client, doc }, thunkApi) => {
    try {
      await client.detach(doc);
      doc = undefined;
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
    selectFirstNetwork(state) {
      const { client, doc } = state;
      doc.update((root) => {
        const networkIDs = Object.keys(root.project.networks);
        const selectedNetworkID = networkIDs[0];
        if (!root.peers[client.getID()]) {
          root.peers[client.getID()] = {} as Peer;
        }
        root.peers[client.getID()].selectedNetworkID = selectedNetworkID;
      });
    },
    createDocument(state, action: PayloadAction<string>) {
      const projectID = action.payload;
      const doc = yorkie.createDocument<MetisDoc>('projects', projectID);
      state.doc = doc;
    },
    attachDocLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setStatus(state, action: PayloadAction<DocStatus>) {
      state.status = action.payload;
    },
    addNetwork(state, action: PayloadAction<string>) {
      const { client, doc } = state;
      const networkName = action.payload;
      const network = createNetwork(networkName);
      doc.update(
        (root) => {
          root.project.networks[network.id] = network;
          root.peers[client.getID()].selectedNetworkID = network.id;
        },
        encodeEventDesc({
          id: network.id,
          entityType: 'network',
          actionType: 'create',
        }),
      );
    },
    updateRefNetwork(state, action: PayloadAction<UpdateRefNetworkArgs>) {
      const { doc } = state;
      const { selectedNetworkID, selectedBlockID, networkName } = action.payload;

      doc.update((root) => {
        const project = root.project;
        const network = project.networks[selectedNetworkID];

        // Update network block
        const targetNetwork = Object.values(project.networks).find((network) => network.name === networkName);
        const block = network.blocks[selectedBlockID];
        if (block.type === BlockType.Network) {
          block.refNetwork = targetNetwork ? targetNetwork.id : '';
          block.parameters = targetNetwork ? createNetworkParams(targetNetwork) : {};
        }
      });
    },
    renameNetwork(
      state,
      action: PayloadAction<{
        network: Network;
        newName: string;
      }>,
    ) {
      const { doc } = state;
      const { network, newName } = action.payload;
      doc.update((root) => {
        root.project.networks[network.id].name = newName;
      });
    },
    updateBlockPosition(state, action: PayloadAction<UpdateBlockPositionArgs>) {
      const { doc } = state;
      const { selectedNetworkID, selectedBlockID, blockPosition } = action.payload;

      doc.update((root) => {
        const model = root.project.networks[selectedNetworkID];
        model.blocks[selectedBlockID].position = blockPosition;
      });
    },
    addBlock(
      state,
      action: PayloadAction<{
        networkID: string;
        type: BlockType;
        diagramOffset: Position;
      }>,
    ) {
      const { doc } = state;
      const { networkID, type, diagramOffset } = action.payload;

      doc.update((root) => {
        const network = root.project.networks[networkID];
        const blockLength = Object.values(network.blocks).filter((block: Block) => block.type === type).length;
        const position = { x: 200 + 10 * blockLength - diagramOffset.x, y: 200 + 10 * blockLength - diagramOffset.y };
        const block = createBlock(type, position, blockLength);
        network.blocks[block.id] = block;
      });
    },
    updateCursorPosition(state, action: PayloadAction<Position>) {
      const { client, doc } = state;
      const cursorPosition = action.payload;

      doc.update((root) => {
        if (root.peers && root.peers[client.getID()]) {
          root.peers[client.getID()].cursor = cursorPosition;
        }
      });
    },
    updateBlockType(state, action: PayloadAction<UpdateBlockTypeArgs>) {
      const { doc } = state;
      const { selectedNetworkID, selectedBlockID, blockType } = action.payload;

      doc.update((root) => {
        const { project } = root;
        const model = project.networks[selectedNetworkID];
        model.blocks[selectedBlockID].type = blockType;
        if (isNormalBlockType(blockType)) {
          (model.blocks[selectedBlockID] as any).parameters = createParams(blockType);
        } else {
          (model.blocks[selectedBlockID] as any).parameters = {};
        }
      });
    },
    deleteNetwork(state, action: PayloadAction<Network>) {
      const { client, doc } = state;
      const network = action.payload;

      doc.update(
        (root) => {
          delete root.project.networks[network.id];
          if (root.peers[client.getID()].selectedNetworkID === network.id) {
            root.peers[client.getID()].selectedNetworkID = null;
          }
        },
        encodeEventDesc({
          id: network.id,
          entityType: 'network',
          actionType: 'delete',
        }),
      );
    },
    deleteBlock(state, action: PayloadAction<DeleteBlockArgs>) {
      const { doc } = state;
      const { selectedNetworkID, selectedBlockID } = action.payload;

      doc.update((root) => {
        const network = root.project.networks[selectedNetworkID];
        delete network.blocks[selectedBlockID];
      });
    },
    selectNetwork(state, action: PayloadAction<string>) {
      const { client, doc } = state;
      const NetworkID = action.payload;

      doc.update((root) => {
        root.peers[client.getID()].selectedNetworkID = NetworkID;
      });
    },
    deleteLink(
      state,
      action: PayloadAction<{
        networkID: string;
        linkID: string;
      }>,
    ) {
      const { doc } = state;
      const { networkID, linkID } = action.payload;

      doc.update((root) => {
        const network = root.project.networks[networkID];
        if (network.links[linkID]) {
          delete network.links[linkID];
        }
      });
    },
    addLink(
      state,
      action: PayloadAction<{
        selectedNetworkID: string;
        linkID: string;
        fromBlockID: string;
        toBlockID: string;
      }>,
    ) {
      const { doc } = state;
      const { selectedNetworkID, linkID, fromBlockID, toBlockID } = action.payload;
      doc.update((root) => {
        const network = root.project.networks[selectedNetworkID];
        network.links[linkID] = {
          id: linkID,
          from: fromBlockID,
          to: toBlockID,
        };
      });
    },
    updateProperty(state, action: PayloadAction<UpdatePropertyArgs>) {
      const { doc } = state;
      const { selectedNetworkID, selectedBlockID, key, value } = action.payload;
      doc.update((root) => {
        const { project } = root;
        const network = project.networks[selectedNetworkID];
        network.blocks[selectedBlockID][key] = valueTransition(value);
      });
    },
    updateParameter(state, action: PayloadAction<UpdateParameterArgs>) {
      const { doc } = state;
      const { selectedNetworkID, selectedBlockID, key, value } = action.payload;
      doc.update((root) => {
        const { project } = root;
        const network = project.networks[selectedNetworkID];
        (network.blocks[selectedBlockID] as any).parameters[key] = valueTransition(value);
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(activateClient.fulfilled, (state, { payload }) => {
      state.client = payload.client;
    });
    builder.addCase(activateClient.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(deactivateClient.fulfilled, (state, { payload }) => {
      state.client = payload.client;
    });
    builder.addCase(deactivateClient.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(attachDocument.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
      state.status = DocStatus.Attached;
    });
    builder.addCase(attachDocument.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(detachDocument.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
      state.status = DocStatus.Detached;
    });
    builder.addCase(detachDocument.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
  },
});

export const {
  attachDocLoading,
  setStatus,
  createDocument,
  addNetwork,
  renameNetwork,
  selectFirstNetwork,
  selectNetwork,
  deleteNetwork,
  addBlock,
  updateBlockPosition,
  deleteBlock,
  addLink,
  deleteLink,
  updateCursorPosition,
  updateBlockType,
  updateRefNetwork,
  updateProperty,
  updateParameter,
} = docSlice.actions;

export default docSlice.reducer;

export type BlockIDArgs = { selectedNetworkID: string; selectedBlockID: string };
interface KeyArgs extends BlockIDArgs {
  key: string;
  value: string;
}

interface UpdateRefNetworkArgs extends BlockIDArgs {
  networkName: string;
}
interface UpdateBlockPositionArgs extends BlockIDArgs {
  blockPosition: Position;
}
interface UpdateBlockTypeArgs extends BlockIDArgs {
  blockType: BlockType;
}
interface DeleteBlockArgs extends BlockIDArgs {}
interface UpdatePropertyArgs extends KeyArgs {}
interface UpdateParameterArgs extends KeyArgs {}

type ActivateClientResult = { client: Client };
type DeactivateClientArgs = { client: Client };
type DeactivateClientResult = { client: Client };
type AttachDocArgs = { client: Client; doc: DocumentReplica<MetisDoc> };
type AttachDocResult = { doc: DocumentReplica<MetisDoc> };
type DetachDocArgs = { client: Client; doc: DocumentReplica<MetisDoc> };
type DetachDocResult = { doc: DocumentReplica<MetisDoc> };
