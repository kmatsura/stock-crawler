# Stock Crawler

## Set up

```
1. pnpm install
2. pnpm db:start   # DynamoDB Local
3. pnpm lint && pnpm test && pnpm dev
```

## Run locally

Start the local DynamoDB and launch both servers:

```bash
pnpm install
pnpm db:start
pnpm dev
```

The backend will be available on http://localhost:3000 and the frontend on http://localhost:5173.
Stop DynamoDB with `pnpm db:stop` when finished.
