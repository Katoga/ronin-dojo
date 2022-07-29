FROM    rust:1.44.1-slim-buster AS builder

ENV     INDEXER_VERSION     0.9.7
ENV     INDEXER_URL         https://github.com/romanz/electrs/archive
ENV     RUST_LOG            DEBUG

RUN     apt-get update && \
        apt-get install -y clang cmake git wget && \
        apt-get install -y libsnappy-dev

# Install electrs
RUN     set -ex && \
        wget -qO electrs.tar.gz "$INDEXER_URL/v$INDEXER_VERSION.tar.gz" && \
        tar -xzvf electrs.tar.gz -C "/tmp/electrs" --strip-components 1 && \
        rm electrs.tar.gz

RUN     cd /tmp/electrs && \
        cargo install --locked --path .

FROM    debian:buster-slim

ENV     INDEXER_HOME        /home/indexer

ARG     ELECTRS_LINUX_UID
ARG     ELECTRS_LINUX_GID

COPY    --from=builder /usr/local/cargo/bin/electrs /usr/bin/electrs

# Create group and user indexer
RUN     addgroup --system -gid ${ELECTRS_LINUX_GID} indexer && \
        adduser --system --ingroup indexer -uid ${ELECTRS_LINUX_UID} indexer

# Create data directory
RUN     mkdir "$INDEXER_HOME/electrs" && \
        mkdir "$INDEXER_HOME/db" && \
        chown -h indexer:indexer "$INDEXER_HOME/electrs" && \
        chown -h indexer:indexer "$INDEXER_HOME/db"

# Copy restart script
COPY    ./restart.sh /restart.sh
RUN     chown indexer:indexer /restart.sh && \
        chmod 777 /restart.sh

# Copy electrs.toml
COPY    ./electrs.toml /electrs.toml
RUN     chown indexer:indexer /electrs.toml && \
        chmod 777 /electrs.toml

USER    indexer

EXPOSE  50001
EXPOSE  8080

STOPSIGNAL SIGINT
