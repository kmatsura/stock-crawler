import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import type { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

@Injectable()
export class UsersRepository {
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
      config.credentials = { accessKeyId: 'dummy', secretAccessKey: 'dummy' };
    }

    this.client = DynamoDBDocumentClient.from(new DynamoDBClient(config));
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const res = await this.client.send(
      new ScanCommand({
        TableName: this.table,
        FilterExpression: 'entityType = :et AND email = :email',
        ExpressionAttributeValues: {
          ':et': 'USER',
          ':email': email,
        },
      }),
    );
    const item = res.Items?.[0];
    if (!item) return undefined;
    return {
      uid: item.uid as string,
      email: item.email as string,
      pwdHash: item.pwdHash as string,
    };
  }

  async findAll(): Promise<User[]> {
    const res = await this.client.send(
      new ScanCommand({
        TableName: this.table,
        FilterExpression: 'entityType = :et',
        ExpressionAttributeValues: { ':et': 'USER' },
      }),
    );
    return (res.Items ?? []).map((item) => ({
      uid: item.uid as string,
      email: item.email as string,
      pwdHash: item.pwdHash as string,
    }));
  }

  async save(user: User): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.table,
        Item: {
          PK: `USER#${user.uid}`,
          SK: 'PROFILE',
          entityType: 'USER',
          uid: user.uid,
          email: user.email,
          pwdHash: user.pwdHash,
        },
      }),
    );
  }
}
