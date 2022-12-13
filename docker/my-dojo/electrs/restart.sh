#!/bin/bash
set -e

echo "auth = \"${BITCOIND_RPC_USER}:${BITCOIND_RPC_PASSWORD}\"" > electrs.toml
echo "server_banner = \"Welcome to your RoninDojo ${DOJO_VERSION_TAG} Electrs Server!\"" >> electrs.toml

indexer_options=(
  --log-filters="INFO"
  --index-batch-size="$INDEXER_BATCH_SIZE"
  --db-dir="/home/electrs/db"
  --electrum-rpc-addr="$INDEXER_IP:$INDEXER_RPC_PORT"
  --daemon-p2p-addr="$BITCOIND_IP:8333"
  --daemon-rpc-addr="$BITCOIND_IP:$BITCOIND_RPC_PORT"
  --index-lookup-limit="$INDEXER_TXID_LIMIT"
)

if [ "$COMMON_BTC_NETWORK" == "testnet" ]; then
  indexer_options+=(--network="testnet")
else
  indexer_options+=(--network="bitcoin")
fi

exec electrs "${indexer_options[@]}"
