import { Injectable } from '@nestjs/common';
import { DynamoDb } from '@dvsa/cvs-microservice-common/classes/aws/dynamo-db-client';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { User } from '../domain/models/UserModel';

@Injectable()
export class UserProvider {
  private static dynamoDBTable = process.env.USERS_DDB_TABLE_NAME || 'users';
  private dynamoClient: DynamoDBClient; // `DynamoDBClient` instance is inferred due to assignment in constructor

  constructor() {
    this.dynamoClient = DynamoDb.getClient({ region: 'eu-west-1' });
  }

  async findUserRecord(staffNumber: string) {
    const response = await this.dynamoClient.send(
      new GetCommand({
        TableName: UserProvider.dynamoDBTable,
        Key: { staffNumber },
      }),
    );

    return response.Item || null;
  }

  async postUserRecord(user: User) {
    const response = await this.dynamoClient.send(
      new PutCommand({
        TableName: UserProvider.dynamoDBTable,
        Item: user,
      }),
    );

    return response?.$metadata.httpStatusCode;
  }
}
