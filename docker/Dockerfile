FROM node:10.4.0-alpine

ENV BUILDER_DIR="/opt/game-puzzle"

RUN set -eux \
    && mkdir -p "${BUILDER_DIR}"

COPY package.json "${BUILDER_DIR}"

WORKDIR ${BUILDER_DIR}

RUN set -eux \
    && npm install \
    && mv node_modules /opt/node_modules

CMD ["/opt/node_modules/grunt-cli/bin/grunt", "default"]