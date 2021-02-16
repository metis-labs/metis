import * as jspb from "google-protobuf"

export class CreateDiagramRequest extends jspb.Message {
  getDiagramName(): string;
  setDiagramName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateDiagramRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateDiagramRequest): CreateDiagramRequest.AsObject;
  static serializeBinaryToWriter(message: CreateDiagramRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateDiagramRequest;
  static deserializeBinaryFromReader(message: CreateDiagramRequest, reader: jspb.BinaryReader): CreateDiagramRequest;
}

export namespace CreateDiagramRequest {
  export type AsObject = {
    diagramName: string,
  }
}

export class CreateDiagramResponse extends jspb.Message {
  getDiagram(): Diagram | undefined;
  setDiagram(value?: Diagram): void;
  hasDiagram(): boolean;
  clearDiagram(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateDiagramResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateDiagramResponse): CreateDiagramResponse.AsObject;
  static serializeBinaryToWriter(message: CreateDiagramResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateDiagramResponse;
  static deserializeBinaryFromReader(message: CreateDiagramResponse, reader: jspb.BinaryReader): CreateDiagramResponse;
}

export namespace CreateDiagramResponse {
  export type AsObject = {
    diagram?: Diagram.AsObject,
  }
}

export class Diagram extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Diagram.AsObject;
  static toObject(includeInstance: boolean, msg: Diagram): Diagram.AsObject;
  static serializeBinaryToWriter(message: Diagram, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Diagram;
  static deserializeBinaryFromReader(message: Diagram, reader: jspb.BinaryReader): Diagram;
}

export namespace Diagram {
  export type AsObject = {
    id: number,
    name: string,
  }
}

