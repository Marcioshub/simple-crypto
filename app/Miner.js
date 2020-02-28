const Wallet = require("../wallet");
const Transaction = require("../wallet/Transaction");

class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransactions = this.transactionPool.validTransactions();
    // reward for miner
    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    );

    // create a block consisting of the valid transactions
    const block = this.blockchain.addBlock(validTransactions);

    // sync all chains in p2p server
    this.p2pServer.syncChains();

    // clear transaction pool
    this.transactionPool.clear();

    // broadcast to every miner to clear their tranaction pools
    this.p2pServer.broadcastClearTransactions();

    return block;
  }
}

module.exports = Miner;
