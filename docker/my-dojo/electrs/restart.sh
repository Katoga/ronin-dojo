#!/bin/bash
set -e

indexer_options=(
  --log-filters="INFO"
  --index-batch-size="$INDEXER_BATCH_SIZE"
  --db-dir="/home/indexer/db"
  --electrum-rpc-addr="$INDEXER_IP:$INDEXER_RPC_PORT"
  --daemon-p2p-addr="$BITCOIND_IP:8333"
  --index-lookup-limit
)

if [ "$COMMON_BTC_NETWORK" == "testnet" ]; then
  indexer_options+=(--network="testnet")
else
  indexer_options+=(--network="mainnet")
fi

electrs "${indexer_options[@]}"
