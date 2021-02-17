import * as grpcWeb from 'grpc-web';

import {
  CreateModelRequest,
  CreateModelResponse} from './metis_pb';

export class MetisClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  createModel(
    request: CreateModelRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: CreateModelResponse) => void
  ): grpcWeb.ClientReadableStream<CreateModelResponse>;

}

export class MetisPromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  createModel(
    request: CreateModelRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<CreateModelResponse>;

}

