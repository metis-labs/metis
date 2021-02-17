import * as jspb from 'google-protobuf';

export class CreateModelRequest extends jspb.Message {
  getModelName(): string;
  setModelName(value: string): CreateModelRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateModelRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateModelRequest): CreateModelRequest.AsObject;
  static serializeBinaryToWriter(message: CreateModelRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateModelRequest;
  static deserializeBinaryFromReader(message: CreateModelRequest, reader: jspb.BinaryReader): CreateModelRequest;
}

export namespace CreateModelRequest {
  export type AsObject = {
    modelName: string;
  };
}

export class CreateModelResponse extends jspb.Message {
  getModel(): Model | undefined;
  setModel(value?: Model): CreateModelResponse;
  hasModel(): boolean;
  clearModel(): CreateModelResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateModelResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateModelResponse): CreateModelResponse.AsObject;
  static serializeBinaryToWriter(message: CreateModelResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateModelResponse;
  static deserializeBinaryFromReader(message: CreateModelResponse, reader: jspb.BinaryReader): CreateModelResponse;
}

export namespace CreateModelResponse {
  export type AsObject = {
    model?: Model.AsObject;
  };
}

export class ListProjectsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListProjectsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListProjectsRequest): ListProjectsRequest.AsObject;
  static serializeBinaryToWriter(message: ListProjectsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListProjectsRequest;
  static deserializeBinaryFromReader(message: ListProjectsRequest, reader: jspb.BinaryReader): ListProjectsRequest;
}

export namespace ListProjectsRequest {
  export type AsObject = {};
}

export class ListProjectsResponse extends jspb.Message {
  getProjectsList(): Array<Project>;
  setProjectsList(value: Array<Project>): ListProjectsResponse;
  clearProjectsList(): ListProjectsResponse;
  addProjects(value?: Project, index?: number): Project;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListProjectsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListProjectsResponse): ListProjectsResponse.AsObject;
  static serializeBinaryToWriter(message: ListProjectsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListProjectsResponse;
  static deserializeBinaryFromReader(message: ListProjectsResponse, reader: jspb.BinaryReader): ListProjectsResponse;
}

export namespace ListProjectsResponse {
  export type AsObject = {
    projectsList: Array<Project.AsObject>;
  };
}

export class Project extends jspb.Message {
  getId(): string;
  setId(value: string): Project;

  getName(): string;
  setName(value: string): Project;

  getModelsMap(): jspb.Map<string, Model>;
  clearModelsMap(): Project;

  getSelectedblockid(): string;
  setSelectedblockid(value: string): Project;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Project.AsObject;
  static toObject(includeInstance: boolean, msg: Project): Project.AsObject;
  static serializeBinaryToWriter(message: Project, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Project;
  static deserializeBinaryFromReader(message: Project, reader: jspb.BinaryReader): Project;
}

export namespace Project {
  export type AsObject = {
    id: string;
    name: string;
    modelsMap: Array<[string, Model.AsObject]>;
    selectedblockid: string;
  };
}

export class Position extends jspb.Message {
  getX(): number;
  setX(value: number): Position;

  getY(): number;
  setY(value: number): Position;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Position.AsObject;
  static toObject(includeInstance: boolean, msg: Position): Position.AsObject;
  static serializeBinaryToWriter(message: Position, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Position;
  static deserializeBinaryFromReader(message: Position, reader: jspb.BinaryReader): Position;
}

export namespace Position {
  export type AsObject = {
    x: number;
    y: number;
  };
}

export class DiagramInfo extends jspb.Message {
  getOffset(): Position | undefined;
  setOffset(value?: Position): DiagramInfo;
  hasOffset(): boolean;
  clearOffset(): DiagramInfo;

  getZoom(): number;
  setZoom(value: number): DiagramInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DiagramInfo.AsObject;
  static toObject(includeInstance: boolean, msg: DiagramInfo): DiagramInfo.AsObject;
  static serializeBinaryToWriter(message: DiagramInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DiagramInfo;
  static deserializeBinaryFromReader(message: DiagramInfo, reader: jspb.BinaryReader): DiagramInfo;
}

export namespace DiagramInfo {
  export type AsObject = {
    offset?: Position.AsObject;
    zoom: number;
  };
}

export class Block extends jspb.Message {
  getId(): string;
  setId(value: string): Block;

  getName(): string;
  setName(value: string): Block;

  getType(): string;
  setType(value: string): Block;

  getPosition(): Position | undefined;
  setPosition(value?: Position): Block;
  hasPosition(): boolean;
  clearPosition(): Block;

  getRepeats(): number;
  setRepeats(value: number): Block;

  getParametersMap(): jspb.Map<string, string>;
  clearParametersMap(): Block;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Block.AsObject;
  static toObject(includeInstance: boolean, msg: Block): Block.AsObject;
  static serializeBinaryToWriter(message: Block, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Block;
  static deserializeBinaryFromReader(message: Block, reader: jspb.BinaryReader): Block;
}

export namespace Block {
  export type AsObject = {
    id: string;
    name: string;
    type: string;
    position?: Position.AsObject;
    repeats: number;
    parametersMap: Array<[string, string]>;
  };
}

export class Link extends jspb.Message {
  getId(): string;
  setId(value: string): Link;

  getFrom(): string;
  setFrom(value: string): Link;

  getTo(): string;
  setTo(value: string): Link;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Link.AsObject;
  static toObject(includeInstance: boolean, msg: Link): Link.AsObject;
  static serializeBinaryToWriter(message: Link, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Link;
  static deserializeBinaryFromReader(message: Link, reader: jspb.BinaryReader): Link;
}

export namespace Link {
  export type AsObject = {
    id: string;
    from: string;
    to: string;
  };
}

export class Dependency extends jspb.Message {
  getId(): string;
  setId(value: string): Dependency;

  getName(): string;
  setName(value: string): Dependency;

  getAlias(): string;
  setAlias(value: string): Dependency;

  getPackage(): string;
  setPackage(value: string): Dependency;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Dependency.AsObject;
  static toObject(includeInstance: boolean, msg: Dependency): Dependency.AsObject;
  static serializeBinaryToWriter(message: Dependency, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Dependency;
  static deserializeBinaryFromReader(message: Dependency, reader: jspb.BinaryReader): Dependency;
}

export namespace Dependency {
  export type AsObject = {
    id: string;
    name: string;
    alias: string;
    pb_package: string;
  };
}

export class Model extends jspb.Message {
  getId(): string;
  setId(value: string): Model;

  getName(): string;
  setName(value: string): Model;

  getType(): DiagramType;
  setType(value: DiagramType): Model;

  getDiagraminfo(): DiagramInfo | undefined;
  setDiagraminfo(value?: DiagramInfo): Model;
  hasDiagraminfo(): boolean;
  clearDiagraminfo(): Model;

  getDependenciesMap(): jspb.Map<string, Dependency>;
  clearDependenciesMap(): Model;

  getBlocksMap(): jspb.Map<string, Block>;
  clearBlocksMap(): Model;

  getLinksMap(): jspb.Map<string, Link>;
  clearLinksMap(): Model;

  getSelectedBlockId(): string;
  setSelectedBlockId(value: string): Model;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Model.AsObject;
  static toObject(includeInstance: boolean, msg: Model): Model.AsObject;
  static serializeBinaryToWriter(message: Model, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Model;
  static deserializeBinaryFromReader(message: Model, reader: jspb.BinaryReader): Model;
}

export namespace Model {
  export type AsObject = {
    id: string;
    name: string;
    type: DiagramType;
    diagraminfo?: DiagramInfo.AsObject;
    dependenciesMap: Array<[string, Dependency.AsObject]>;
    blocksMap: Array<[string, Block.AsObject]>;
    linksMap: Array<[string, Link.AsObject]>;
    selectedBlockId: string;
  };
}

export enum DiagramType {
  MAIN = 0,
  MODULE = 1,
}
