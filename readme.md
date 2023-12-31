# Setup
- `pnpm install`
- `cp infra/.env.example infra/.env`
- `pnpm docker:dev:up`
- `pnpm backend:migration:run`

## Development environment
- infra/.env -> ENV_TYPE=dev
- `pnpm docker:dev:up`

## Production environment
- infra/.env -> ENV_TYPE=prod
- `pnpm docker:prod:up`

# Build docker image & push example
- **docker build:** ```docker build -f infra/Dockerfile -t kisstamas/backend:1.0 --target backend-dev .```
- **docker push**: ```docker push kisstamas/backend:1.0```

# Setup workspace packages
- create folder into packages folder
- add to root tsconfig.base.json file paths attribute

# Authentication

- basic user entity:
  - id: string
  - email: string (unique)
  - name: string
  - password: string
  - refreshToken
- authorization with accessToken and refreshToken. If accessToken expired it can be refreshed with the refreshToken.

# API endpoints

<table>
<tr>
<th>Description</th>
<th>Method</th>
<th>URL</th>
<th>Param</th>
<th>Body</th>
<th>Header</th>
<th>Status</th>
<th>Response body</th>
</tr>
<tr>
<td>Sign up</td>
<td>POST</td>
<td>/auth/signup</td>
<td>

\-
</td>
<td>{"email","name","password"}</td>
<td> - </td>
<td>201</td>
<td>{id, name, email, tokens: {accessToken, refreshToken}}</td>
</tr>
<tr>
<td>Sign in</td>
<td>POST</td>
<td>/auth/signin</td>
<td>

\-
</td>
<td>{"email", "password"}</td>
<td> - </td>
<td>200</td>
<td>{id, name, email, tokens: {accessToken, refreshToken}}</td>
</tr>
<tr>
<td>Sign out</td>
<td>GET</td>
<td>/auth/logout</td>
<td>

\-
</td>
<td>

\-
</td>
<td>Bearer {accessToken}</td>
<td>200</td>
<td>
success
</td>
</tr>
<tr>
<td>
New accessToken

and refreshToken
</td>
<td>GET</td>
<td>/auth/refresh</td>
<td>

\-
</td>
<td>

\-
</td>
<td>Bearer {refreshToken}</td>
<td>200</td>
<td>{accessToken, refreshToken}</td>
</tr>
</table>

# Auto formatting with prettier and husky

- prettier format runs before every commit
- hooks inside the .husky folder