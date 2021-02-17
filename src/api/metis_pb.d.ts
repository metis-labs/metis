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

export class Model extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Model.AsObject;
  static toObject(includeInstance: boolean, msg: Model): Model.AsObject;
  static serializeBinaryToWriter(message: Model, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Model;
  static deserializeBinaryFromReader(message: Model, reader: jspb.BinaryReader): Model;
}

export namespace Model {
  export type AsObject = {
    id: number,
    name: string,
  }
}

