import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import type { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

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
}
