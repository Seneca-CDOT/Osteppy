# Dockerfile
#
# -------------------------------------
# Context: Build Context
FROM node:lts-alpine as build

# Tini Entrypoint for Alpine
RUN apk add --no-cache tini
ENTRYPOINT [ "/sbin/tini", "--"]

# Set Working Directory Context
WORKDIR "/osteppy"

# Copy package files
COPY package.json .
COPY package-lock.json .

# Context: Dependencies
FROM build AS dependencies

# Install Modules
RUN npm install

# -------------------------------------
# Context: Builder
FROM dependencies as builder

# Copy necessary files to build osteppy
COPY src src
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY nest-cli.json .

RUN npm run build

# -------------------------------------
# Context: Release
FROM build AS release

# GET deployment code from previous containers
COPY --from=dependencies /osteppy/node_modules /osteppy/node_modules
COPY --from=builder /osteppy/dist /osteppy/dist

# Running osteppy when the image gets built using a script
CMD ["sh", "-c", "npm run start:prod"]
