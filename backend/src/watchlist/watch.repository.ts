import { Injectable } from '@nestjs/common';
import { Watch } from './watch.entity';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import type { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  DeleteCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

@Injectable()
export class WatchRepository {
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

  async findAll(uid: string): Promise<Watch[]> {
    const res = await this.client.send(
      new QueryCommand({
        TableName: this.table,
        KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': `USER#${uid}`,
          ':sk': 'WATCH#',
        },
      }),
    );
    return (res.Items ?? []).map((item) => ({
      uid,
      code: item.code as string,
      createdAt: item.createdAt as string,
    }));
  }

  async save(watch: Watch): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.table,
        Item: {
          PK: `USER#${watch.uid}`,
          SK: `WATCH#${watch.code}`,
          entityType: 'WATCH',
          code: watch.code,
          createdAt: watch.createdAt,
        },
      }),
    );
  }

  async remove(uid: string, code: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: this.table,
        Key: {
          PK: `USER#${uid}`,
          SK: `WATCH#${code}`,
        },
      }),
    );
  }
}
