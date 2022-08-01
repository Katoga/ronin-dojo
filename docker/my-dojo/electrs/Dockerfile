FROM    rust:1.44.1-slim-buster AS builder

ENV     ELECTRS_VERSION     0.9.7
ENV     ELECTRS_URL         https://github.com/romanz/electrs/archive

RUN     apt-get update && \
        apt-get install -y clang cmake wget && \
        apt-get install -y libsnappy-dev

# Install electrs
RUN     set -ex && \
        wget -qO electrs.tar.gz "$ELECTRS_URL/v$ELECTRS_VERSION.tar.gz" && \
        tar -xzvf electrs.tar.gz -C "/tmp/electrs" --strip-components 1 && \
        rm electrs.tar.gz

RUN     cd /tmp/electrs && \
        cargo install --locked --path .

FROM    debian:buster-slim

ENV     ELECTRS_HOME        /home/electrs

ARG     ELECTRS_LINUX_UID
ARG     ELECTRS_LINUX_GID

COPY    --from=builder /usr/local/cargo/bin/electrs /usr/bin/electrs

# Create group and user electrs
RUN     addgroup --system -gid ${ELECTRS_LINUX_GID} electrs && \
        adduser --system --ingroup electrs -uid ${ELECTRS_LINUX_UID} electrs

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
