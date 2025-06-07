# Stock Crawler

## Set up

```
1. pnpm install
2. pnpm db:start   # DynamoDB Local
3. pnpm lint && pnpm test && pnpm dev
```

## Running locally

1. Copy environment variables

```bash
cp backend/.env.example backend/.env
# edit backend/.env and set JWT_SECRET
```

2. Start the database and backend

```bash
pnpm db:start
pnpm --filter ./backend dev
```

3. In a separate terminal, start the frontend

```bash
pnpm --filter ./frontend/app dev
```

The API runs on `http://localhost:3000` and the frontend on `http://localhost:5173`.
