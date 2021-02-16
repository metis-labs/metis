/**
 * @fileoverview gRPC-Web generated client stub for api
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.api = require('./metis_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.api.MetisClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.api.MetisPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.api.CreateDiagramRequest,
 *   !proto.api.CreateDiagramResponse>}
 */
const methodDescriptor_Metis_CreateDiagram = new grpc.web.MethodDescriptor(
  '/api.Metis/CreateDiagram',
  grpc.web.MethodType.UNARY,
  proto.api.CreateDiagramRequest,
  proto.api.CreateDiagramResponse,
  /**
   * @param {!proto.api.CreateDiagramRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.api.CreateDiagramResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.api.CreateDiagramRequest,
 *   !proto.api.CreateDiagramResponse>}
 */
const methodInfo_Metis_CreateDiagram = new grpc.web.AbstractClientBase.MethodInfo(
  proto.api.CreateDiagramResponse,
  /**
   * @param {!proto.api.CreateDiagramRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.api.CreateDiagramResponse.deserializeBinary
);


/**
 * @param {!proto.api.CreateDiagramRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.api.CreateDiagramResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.api.CreateDiagramResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.api.MetisClient.prototype.createDiagram =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/api.Metis/CreateDiagram',
      request,
      metadata || {},
      methodDescriptor_Metis_CreateDiagram,
      callback);
};


/**
 * @param {!proto.api.CreateDiagramRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.api.CreateDiagramResponse>}
 *     A native promise that resolves to the response
 */
proto.api.MetisPromiseClient.prototype.createDiagram =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/api.Metis/CreateDiagram',
      request,
      metadata || {},
      methodDescriptor_Metis_CreateDiagram);
};


module.exports = proto.api;

