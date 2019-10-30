FROM node:10.4.0-alpine

ENV BUILDER_DIR="/opt/game-puzzle"
ENV NODE_MODULES_DIR="/opt/node_modules"

RUN set -eux \
    && mkdir -p "${BUILDER_DIR}"

COPY package.json package-lock.json ${BUILDER_DIR}/
COPY docker/usr/bin/docker-entrypoint.sh /usr/bin

RUN set -eux \
    && chmod +x /usr/bin/docker-entrypoint.sh

WORKDIR ${BUILDER_DIR}

RUN set -eux \
    && npm install \
    && mv "node_modules" "${NODE_MODULES_DIR}"

CMD ["/usr/bin/docker-entrypoint.sh"]