#!/bin/bash
set -e

sed -i \
  -e "s/BITCOIND_RPC_USER/${BITCOIND_RPC_USER}/g" \
  -e "s/BITCOIND_RPC_PASSWORD/${BITCOIND_RPC_PASSWORD}/g" \
  -e "s/DOJO_VERSION_TAG/${DOJO_VERSION_TAG}/g" \
  /electrs.toml

indexer_options=(
  --log-filters="INFO"
  --index-batch-size="$INDEXER_BATCH_SIZE"
  --db-dir="/home/indexer/db"
  --electrum-rpc-addr="$INDEXER_IP:$INDEXER_RPC_PORT"
  --daemon-p2p-addr="$BITCOIND_IP:8333"
  --index-lookup-limit="$INDEXER_TXID_LIMIT"
)

if [ "$COMMON_BTC_NETWORK" == "testnet" ]; then
  indexer_options+=(--network="testnet")
else
  indexer_options+=(--network="bitcoin")
fi

exec electrs "${indexer_options[@]}"
