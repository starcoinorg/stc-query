const extend = require('xtend')
const createRandomId = require('json-rpc-random-id')()

module.exports = StcQuery


function StcQuery(provider){
  const self = this
  self.currentProvider = provider
}

//
// base queries
//

// default block
StcQuery.prototype.getBalance =                          generateFnFor('contract.get_resource')
StcQuery.prototype.getCode =                             generateFnWithDefaultBlockFor(2, 'eth_getCode')
StcQuery.prototype.getTransactionCount =                 generateFnWithDefaultBlockFor(2, 'eth_getTransactionCount')
StcQuery.prototype.getStorageAt =                        generateFnWithDefaultBlockFor(3, 'eth_getStorageAt')
StcQuery.prototype.call =                                generateFnWithDefaultBlockFor(2, 'eth_call')
// standard
StcQuery.prototype.protocolVersion =                     generateFnFor('eth_protocolVersion')
StcQuery.prototype.syncing =                             generateFnFor('eth_syncing')
StcQuery.prototype.coinbase =                            generateFnFor('eth_coinbase')
StcQuery.prototype.mining =                              generateFnFor('eth_mining')
StcQuery.prototype.hashrate =                            generateFnFor('eth_hashrate')
StcQuery.prototype.gasPrice =                            generateFnFor('eth_gasPrice')
StcQuery.prototype.accounts =                            generateFnFor('eth_accounts')
StcQuery.prototype.blockNumber =                         generateFnFor('eth_blockNumber')
StcQuery.prototype.getBlockTransactionCountByHash =      generateFnFor('eth_getBlockTransactionCountByHash')
StcQuery.prototype.getBlockTransactionCountByNumber =    generateFnFor('eth_getBlockTransactionCountByNumber')
StcQuery.prototype.getUncleCountByBlockHash =            generateFnFor('eth_getUncleCountByBlockHash')
StcQuery.prototype.getUncleCountByBlockNumber =          generateFnFor('eth_getUncleCountByBlockNumber')
StcQuery.prototype.sign =                                generateFnFor('eth_sign')
StcQuery.prototype.sendTransaction =                     generateFnFor('eth_sendTransaction')
StcQuery.prototype.sendRawTransaction =                  generateFnFor('eth_sendRawTransaction')
StcQuery.prototype.estimateGas =                         generateFnFor('eth_estimateGas')
StcQuery.prototype.getBlockByHash =                      generateFnFor('eth_getBlockByHash')
StcQuery.prototype.getBlockByNumber =                    generateFnFor('chain.get_block_by_number')
StcQuery.prototype.getTransactionByHash =                generateFnFor('eth_getTransactionByHash')
StcQuery.prototype.getTransactionByBlockHashAndIndex =   generateFnFor('eth_getTransactionByBlockHashAndIndex')
StcQuery.prototype.getTransactionByBlockNumberAndIndex = generateFnFor('eth_getTransactionByBlockNumberAndIndex')
StcQuery.prototype.getTransactionReceipt =               generateFnFor('eth_getTransactionReceipt')
StcQuery.prototype.getUncleByBlockHashAndIndex =         generateFnFor('eth_getUncleByBlockHashAndIndex')
StcQuery.prototype.getUncleByBlockNumberAndIndex =       generateFnFor('eth_getUncleByBlockNumberAndIndex')
StcQuery.prototype.getCompilers =                        generateFnFor('eth_getCompilers')
StcQuery.prototype.compileLLL =                          generateFnFor('eth_compileLLL')
StcQuery.prototype.compileSolidity =                     generateFnFor('eth_compileSolidity')
StcQuery.prototype.compileSerpent =                      generateFnFor('eth_compileSerpent')
StcQuery.prototype.newFilter =                           generateFnFor('eth_newFilter')
StcQuery.prototype.newBlockFilter =                      generateFnFor('eth_newBlockFilter')
StcQuery.prototype.newPendingTransactionFilter =         generateFnFor('eth_newPendingTransactionFilter')
StcQuery.prototype.uninstallFilter =                     generateFnFor('eth_uninstallFilter')
StcQuery.prototype.getFilterChanges =                    generateFnFor('eth_getFilterChanges')
StcQuery.prototype.getFilterLogs =                       generateFnFor('eth_getFilterLogs')
StcQuery.prototype.getLogs =                             generateFnFor('eth_getLogs')
StcQuery.prototype.getWork =                             generateFnFor('eth_getWork')
StcQuery.prototype.submitWork =                          generateFnFor('eth_submitWork')
StcQuery.prototype.submitHashrate =                      generateFnFor('eth_submitHashrate')

// network level

StcQuery.prototype.sendAsync = function(opts, cb){
  const self = this
  self.currentProvider.sendAsync(createPayload(opts), function(err, response){
    if (!err && response.error) err = new Error('StcQuery - RPC Error - '+response.error.message)
    if (err) return cb(err)
    cb(null, response.result)
  })
}

// util

function generateFnFor(methodName){
  return function(){
    const self = this
    var args = [].slice.call(arguments)
    var cb = args.pop()
    self.sendAsync({
      method: methodName,
      params: args,
    }, cb)
  }
}

function generateFnWithDefaultBlockFor(argCount, methodName){
  return function(){
    const self = this
    var args = [].slice.call(arguments)
    var cb = args.pop()
    // set optional default block param
    if (args.length < argCount) args.push('latest')
    self.sendAsync({
      method: methodName,
      params: args,
    }, cb)
  }
}

function createPayload(data){
  return extend({
    // defaults
    id: createRandomId(),
    jsonrpc: '2.0',
    params: [],
    // user-specified
  }, data)
}
