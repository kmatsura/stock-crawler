import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';
import type {
  CreateTableCommandInput,
  DynamoDBClientConfig,
} from '@aws-sdk/client-dynamodb';

const table = process.env.DYNAMO_TABLE ?? 'Stocks';

const config: DynamoDBClientConfig = {};
if (process.env.DYNAMO_ENDPOINT) {
  config.endpoint = process.env.DYNAMO_ENDPOINT;
  config.region = process.env.AWS_REGION ?? 'local';
  config.credentials = { accessKeyId: 'dummy', secretAccessKey: 'dummy' };
}

const client = new DynamoDBClient(config);

async function main(): Promise<void> {
  const params: CreateTableCommandInput = {
    TableName: table,
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  };

  try {
    await client.send(new CreateTableCommand(params));
    console.log(`Created table ${table}`);
  } catch (err) {
    if ((err as { name?: string }).name === 'ResourceInUseException') {
      console.log(`Table ${table} already exists`);
    } else {
      console.error('Failed to create table', err);
      throw err;
    }
  }
}

main().catch(() => process.exit(1));
