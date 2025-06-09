# Stock Crawler

## Set up

```
1. pnpm install
2. pnpm db:start   # DynamoDB Local (creates ./dynamo_data)
3. pnpm db:seed    # create the Stocks table
4. pnpm lint && pnpm test && pnpm dev
```

## Run locally

Start the local DynamoDB and launch both servers:

```bash
pnpm install
pnpm db:start
pnpm db:seed    # create the Stocks table
pnpm dev
```

If the DynamoDB container fails with an SQLite error, make sure the
`dynamo_data` folder exists and is writable (created automatically by
`db:start`). You can run `chmod 777 dynamo_data` to fix permissions.

The backend will be available on http://localhost:3000 and the frontend on http://localhost:5173.
Stop DynamoDB with `pnpm db:stop` when finished.

## Price Crawler CLI

After setting up `.env` in `backend/` (see `.env.example`), you can fetch and
store the closing price of a TSE code using the CLI:

```bash
pnpm --filter backend run crawl 7203
```

When running locally, set `DYNAMO_ENDPOINT=http://localhost:8000` in
`backend/.env` so the CLI writes to DynamoDB Local.

## サンプルユーザー作成

バックエンド起動後、以下のコマンドでログイン用のテストユーザーを登録できます。

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"sample@example.com","password":"password"}'
```

## Deploy to AWS

To deploy the development stack, run:

```bash
sam build && sam deploy --stack-name stock-crawler-dev --capabilities CAPABILITY_IAM
```

