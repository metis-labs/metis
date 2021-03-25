import * as jspb from "google-protobuf"

export class CreateModelRequest extends jspb.Message {
  getModelName(): string;
  setModelName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateModelRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateModelRequest): CreateModelRequest.AsObject;
  static serializeBinaryToWriter(message: CreateModelRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateModelRequest;
  static deserializeBinaryFromReader(message: CreateModelRequest, reader: jspb.BinaryReader): CreateModelRequest;
}

export namespace CreateModelRequest {
  export type AsObject = {
    modelName: string,
  }
}

export class CreateModelResponse extends jspb.Message {
  getModel(): Model | undefined;
  setModel(value?: Model): void;
  hasModel(): boolean;
  clearModel(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateModelResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateModelResponse): CreateModelResponse.AsObject;
  static serializeBinaryToWriter(message: CreateModelResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateModelResponse;
  static deserializeBinaryFromReader(message: CreateModelResponse, reader: jspb.BinaryReader): CreateModelResponse;
}

export namespace CreateModelResponse {
  export type AsObject = {
    model?: Model.AsObject,
  }
}

export class CreateProjectRequest extends jspb.Message {
  getProjectName(): string;
  setProjectName(value: string): void;

  getTemplateId(): string;
  setTemplateId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateProjectRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateProjectRequest): CreateProjectRequest.AsObject;
  static serializeBinaryToWriter(message: CreateProjectRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateProjectRequest;
  static deserializeBinaryFromReader(message: CreateProjectRequest, reader: jspb.BinaryReader): CreateProjectRequest;
}

export namespace CreateProjectRequest {
  export type AsObject = {
    projectName: string,
    templateId: string,
  }
}

export class CreateProjectResponse extends jspb.Message {
  getProject(): Project | undefined;
  setProject(value?: Project): void;
  hasProject(): boolean;
  clearProject(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateProjectResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateProjectResponse): CreateProjectResponse.AsObject;
  static serializeBinaryToWriter(message: CreateProjectResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateProjectResponse;
  static deserializeBinaryFromReader(message: CreateProjectResponse, reader: jspb.BinaryReader): CreateProjectResponse;
}

export namespace CreateProjectResponse {
  export type AsObject = {
    project?: Project.AsObject,
  }
}

export class UpdateProjectRequest extends jspb.Message {
  getProjectId(): string;
  setProjectId(value: string): void;

  getProjectName(): string;
  setProjectName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateProjectRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateProjectRequest): UpdateProjectRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateProjectRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateProjectRequest;
  static deserializeBinaryFromReader(message: UpdateProjectRequest, reader: jspb.BinaryReader): UpdateProjectRequest;
}

export namespace UpdateProjectRequest {
  export type AsObject = {
    projectId: string,
    projectName: string,
  }
}

export class UpdateProjectResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateProjectResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateProjectResponse): UpdateProjectResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateProjectResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateProjectResponse;
  static deserializeBinaryFromReader(message: UpdateProjectResponse, reader: jspb.BinaryReader): UpdateProjectResponse;
}

export namespace UpdateProjectResponse {
  export type AsObject = {
  }
}

export class DeleteProjectRequest extends jspb.Message {
  getProjectId(): string;
  setProjectId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteProjectRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteProjectRequest): DeleteProjectRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteProjectRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteProjectRequest;
  static deserializeBinaryFromReader(message: DeleteProjectRequest, reader: jspb.BinaryReader): DeleteProjectRequest;
}

export namespace DeleteProjectRequest {
  export type AsObject = {
    projectId: string,
  }
}

export class DeleteProjectResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteProjectResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteProjectResponse): DeleteProjectResponse.AsObject;
  static serializeBinaryToWriter(message: DeleteProjectResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteProjectResponse;
  static deserializeBinaryFromReader(message: DeleteProjectResponse, reader: jspb.BinaryReader): DeleteProjectResponse;
}

export namespace DeleteProjectResponse {
  export type AsObject = {
  }
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
  export type AsObject = {
  }
}

export class ListProjectsResponse extends jspb.Message {
  getProjectsList(): Array<Project>;
  setProjectsList(value: Array<Project>): void;
  clearProjectsList(): void;
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
    projectsList: Array<Project.AsObject>,
  }
}

export class Project extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getModelsMap(): jspb.Map<string, Model>;
  clearModelsMap(): void;

  getSelectedBlockId(): string;
  setSelectedBlockId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Project.AsObject;
  static toObject(includeInstance: boolean, msg: Project): Project.AsObject;
  static serializeBinaryToWriter(message: Project, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Project;
  static deserializeBinaryFromReader(message: Project, reader: jspb.BinaryReader): Project;
}

export namespace Project {
  export type AsObject = {
    id: string,
    name: string,
    modelsMap: Array<[string, Model.AsObject]>,
    selectedBlockId: string,
  }
}

export class Position extends jspb.Message {
  getX(): number;
  setX(value: number): void;

  getY(): number;
  setY(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Position.AsObject;
  static toObject(includeInstance: boolean, msg: Position): Position.AsObject;
  static serializeBinaryToWriter(message: Position, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Position;
  static deserializeBinaryFromReader(message: Position, reader: jspb.BinaryReader): Position;
}

export namespace Position {
  export type AsObject = {
    x: number,
    y: number,
  }
}

export class DiagramInfo extends jspb.Message {
  getOffset(): Position | undefined;
  setOffset(value?: Position): void;
  hasOffset(): boolean;
  clearOffset(): void;

  getZoom(): number;
  setZoom(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DiagramInfo.AsObject;
  static toObject(includeInstance: boolean, msg: DiagramInfo): DiagramInfo.AsObject;
  static serializeBinaryToWriter(message: DiagramInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DiagramInfo;
  static deserializeBinaryFromReader(message: DiagramInfo, reader: jspb.BinaryReader): DiagramInfo;
}

export namespace DiagramInfo {
  export type AsObject = {
    offset?: Position.AsObject,
    zoom: number,
  }
}

export class Block extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getType(): string;
  setType(value: string): void;

  getPosition(): Position | undefined;
  setPosition(value?: Position): void;
  hasPosition(): boolean;
  clearPosition(): void;

  getRepeats(): number;
  setRepeats(value: number): void;

  getParametersMap(): jspb.Map<string, string>;
  clearParametersMap(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Block.AsObject;
  static toObject(includeInstance: boolean, msg: Block): Block.AsObject;
  static serializeBinaryToWriter(message: Block, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Block;
  static deserializeBinaryFromReader(message: Block, reader: jspb.BinaryReader): Block;
}

export namespace Block {
  export type AsObject = {
    id: string,
    name: string,
    type: string,
    position?: Position.AsObject,
    repeats: number,
    parametersMap: Array<[string, string]>,
  }
}

export class Link extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getFrom(): string;
  setFrom(value: string): void;

  getTo(): string;
  setTo(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Link.AsObject;
  static toObject(includeInstance: boolean, msg: Link): Link.AsObject;
  static serializeBinaryToWriter(message: Link, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Link;
  static deserializeBinaryFromReader(message: Link, reader: jspb.BinaryReader): Link;
}

export namespace Link {
  export type AsObject = {
    id: string,
    from: string,
    to: string,
  }
}

export class Dependency extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getAlias(): string;
  setAlias(value: string): void;

  getPackage(): string;
  setPackage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Dependency.AsObject;
  static toObject(includeInstance: boolean, msg: Dependency): Dependency.AsObject;
  static serializeBinaryToWriter(message: Dependency, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Dependency;
  static deserializeBinaryFromReader(message: Dependency, reader: jspb.BinaryReader): Dependency;
}

export namespace Dependency {
  export type AsObject = {
    id: string,
    name: string,
    alias: string,
    pb_package: string,
  }
}

export class Model extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getType(): DiagramType;
  setType(value: DiagramType): void;

  getDiagramInfo(): DiagramInfo | undefined;
  setDiagramInfo(value?: DiagramInfo): void;
  hasDiagramInfo(): boolean;
  clearDiagramInfo(): void;

  getDependenciesMap(): jspb.Map<string, Dependency>;
  clearDependenciesMap(): void;

  getBlocksMap(): jspb.Map<string, Block>;
  clearBlocksMap(): void;

  getLinksMap(): jspb.Map<string, Link>;
  clearLinksMap(): void;

  getSelectedBlockId(): string;
  setSelectedBlockId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Model.AsObject;
  static toObject(includeInstance: boolean, msg: Model): Model.AsObject;
  static serializeBinaryToWriter(message: Model, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Model;
  static deserializeBinaryFromReader(message: Model, reader: jspb.BinaryReader): Model;
}

export namespace Model {
  export type AsObject = {
    id: string,
    name: string,
    type: DiagramType,
    diagramInfo?: DiagramInfo.AsObject,
    dependenciesMap: Array<[string, Dependency.AsObject]>,
    blocksMap: Array<[string, Block.AsObject]>,
    linksMap: Array<[string, Link.AsObject]>,
    selectedBlockId: string,
  }
}

export enum DiagramType { 
  MAIN = 0,
  MODULE = 1,
}
