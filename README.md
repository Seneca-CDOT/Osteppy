Server backend for Osteppy App - OSTEP that:

- Manage EoDs (End of Day).
- Check unintended open ports on research machines.

## Slash commands on Slack

- `/eod`: submits an EoD. EoD can be re-submitted within one day, it'll replace the previous submitted EoD.
- `/eod :<icon>:` same as above but with custom Slack icon.
- `/add-to-eod`: add a single task to current EoD.
- `/remove-from-eod <index>`: remove a single task from current EoD (index starts from `0`).
- `/list-ports`: list registered ports on research machines.
- `/list-ports <domain>`: list registered ports on a specific domain (ex. `/list-ports sweden`).

## Project structure

The server uses Nest.JS to manage different modules:

- `/src/database`: manages database, currently used to store EoDs.
- `/src/slack`: communicates with Slack server API.
- `/src/users`: manages RA profiles.
- `/src/system`: manages port checking.

## Installation

1. Clone the repo.
1. Install dependencies via `npm i`.
1. Config environment variables from the example file `cp env.example .env`.
    - `COMPOSE_FILE=docker-compose.yml;production.yml` for running the server.
    - `COMPOSE_FILE=docker-compose.yml;development.yml` for developing the server.
    - Complete other fields based on the Slack workspace.
1. Config registered open ports from the example file `cp /config_files/domains.example.json domains.json`.
1. Run the server with `docker-compose up --build [-d]` (`-d` for detach mode).
    - In development mode, only `database` container runs with `docker-compose`. The `node.js` server runs seperately by `npm run start:dev` for convenience.
1. Stop the server with `docker-compose down`.

## Current setup for OSTEP

- Slack API: https://api.slack.com/apps/ACQG3QHBJ
- Slack API Slash commands: https://api.slack.com/apps/ACQG3QHBJ/slash-commands?
- `Osteppy` is hosted on `spain.cdot.systems:/opt/Osteppy/`
  - Registed ports config is at `spain.cdot.systems:/opt/Osteppy/config_files/domains.json`
  - Editing the ports requires re-running the server.
