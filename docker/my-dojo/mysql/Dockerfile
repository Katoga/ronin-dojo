FROM    mariadb:11.8.2

RUN apt-get update \
  && apt-get upgrade --assume-yes --no-install-recommends \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Copy mysql config
COPY    ./docker/my-dojo/mysql/mysql-dojo.cnf /etc/mysql/conf.d/mysql-dojo.cnf

# Copy update-db script
COPY    --chmod=754 ./docker/my-dojo/mysql/update-db.sh /update-db.sh

# Copy content of mysql scripts into /docker-entrypoint-initdb.d
COPY    ./db-scripts/ /docker-entrypoint-initdb.d
