import * as grpcWeb from 'grpc-web';

import {
  CreateDiagramRequest,
  CreateDiagramResponse} from './metis_pb';

export class MetisClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  createDiagram(
    request: CreateDiagramRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: CreateDiagramResponse) => void
  ): grpcWeb.ClientReadableStream<CreateDiagramResponse>;

}

export class MetisPromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  createDiagram(
    request: CreateDiagramRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<CreateDiagramResponse>;

}

