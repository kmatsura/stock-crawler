import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import type { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

export class PriceRepository {
  private readonly client: DynamoDBDocumentClient;
  private readonly table = process.env.DYNAMO_TABLE ?? 'Stocks';

  constructor(client?: DynamoDBDocumentClient) {
    if (client) {
      this.client = client;
      return;
    }

    const config: DynamoDBClientConfig = {};
    if (process.env.DYNAMO_ENDPOINT) {
      config.endpoint = process.env.DYNAMO_ENDPOINT;
      config.region = process.env.AWS_REGION ?? 'local';
      config.credentials = {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy',
      };
    }

    this.client = DynamoDBDocumentClient.from(new DynamoDBClient(config));
  }

  async put(item: Record<string, any>): Promise<void> {
    await this.client.send(
      new PutCommand({ TableName: this.table, Item: item }),
    );
  }

  async findLatestPriceByCode(
    code: number,
  ): Promise<{ price: number; tsISO: string } | undefined> {
    const pk = `STOCK#${code}#${new Date().getUTCFullYear()}`;
    const res = await this.client.send(
      new QueryCommand({
        TableName: this.table,
        KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': pk,
          ':sk': 'PRICE#',
        },
        ScanIndexForward: false,
        Limit: 1,
      }),
    );
    const item = res.Items?.[0];
    if (!item) return undefined;
    return {
      price: item.price as number,
      tsISO: item.tsISO as string,
    };
  }
}
