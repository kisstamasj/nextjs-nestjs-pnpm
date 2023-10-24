# Setup
- `cp infra/.env.example infra/.env`
- `pnpm docker:dev:up`

# Build docker image & push example
- **docker build:** ```docker build -f infra/Dockerfile -t kisstamas/backend:1.0 --target backend-dev .```
- **docker push**: ```docker push kisstamas/backend:1.0```