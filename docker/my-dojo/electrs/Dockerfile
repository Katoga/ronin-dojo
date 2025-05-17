FROM    rust:1.87.0-slim-bookworm AS builder

ENV     ELECTRS_VERSION     0.10.9
ENV     ELECTRS_URL         https://github.com/romanz/electrs/archive
ENV     ELECTRS_SHA256      d8990bf530f886e6426f9f599894f6e8065d11b90394e76e63d709a6b3765313

RUN     apt-get update && \
        apt-get install -y clang cmake wget libsnappy-dev

# Install electrs
RUN     set -ex && \
        mkdir /tmp/electrs && \
        cd /tmp/electrs && \
        wget -qO electrs.tar.gz "$ELECTRS_URL/v$ELECTRS_VERSION.tar.gz" && \
        echo "${ELECTRS_SHA256} electrs.tar.gz" | sha256sum -c - && \
        tar -xzvf electrs.tar.gz -C "/tmp/electrs" --strip-components 1 && \
        rm electrs.tar.gz

RUN     cd /tmp/electrs && \
        cargo install --locked --path .

FROM    debian:bookworm-slim

ENV     ELECTRS_HOME        /home/electrs

ARG     ELECTRS_LINUX_UID
ARG     ELECTRS_LINUX_GID

COPY    --from=builder /usr/local/cargo/bin/electrs /usr/bin/electrs

# Create group and user electrs
RUN     addgroup --system -gid ${ELECTRS_LINUX_GID} electrs && \
        adduser --system --ingroup electrs -uid ${ELECTRS_LINUX_UID} --home ${ELECTRS_HOME} electrs

# Create data directory
RUN     mkdir "$ELECTRS_HOME/electrs" && \
        mkdir "$ELECTRS_HOME/db" && \
        chown -h electrs:electrs "$ELECTRS_HOME/electrs" && \
        chown -h electrs:electrs "$ELECTRS_HOME/db"

# Copy restart script
COPY    ./restart.sh /restart.sh
RUN     chown electrs:electrs /restart.sh && \
        chmod 777 /restart.sh

# Copy electrs.toml
COPY    ./electrs.toml /electrs.toml
RUN     chown electrs:electrs /electrs.toml && \
        chmod 777 /electrs.toml

USER    electrs

EXPOSE  50001

STOPSIGNAL SIGINT
