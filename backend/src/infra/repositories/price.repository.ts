import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

export class PriceRepository {
  private readonly client: DynamoDBDocumentClient;
  private readonly table = process.env.DYNAMO_TABLE ?? 'Stocks';

  constructor(client?: DynamoDBDocumentClient) {
    this.client = client ?? DynamoDBDocumentClient.from(new DynamoDBClient({}));
  }

  async put(item: Record<string, any>): Promise<void> {
    await this.client.send(
      new PutCommand({ TableName: this.table, Item: item }),
    );
  }
}
