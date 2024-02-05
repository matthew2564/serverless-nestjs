import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserProvider } from '../providers/UserProvider';
import { ErrorEnum } from '../domain/enums/Error.enum';
import { User } from '../domain/models/UserModel';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => UserProvider)) private userProvider: UserProvider,
  ) {}

  async getUserByStaffNumber(staffNumber: string): Promise<void> {
    const user = await this.userProvider.findUserRecord(staffNumber);

    if (!user) {
      throw new NotFoundException(
        `User with staff number ${staffNumber} not found`,
      );
    }
  }

  async postUser(user: User): Promise<void> {
    const statusCode = await this.userProvider.postUserRecord(user);

    if (statusCode !== 200) {
      throw new HttpException(
        `${ErrorEnum.CREATING}. StatusCode from DynamoDB: ${statusCode}`,
        500,
      );
    }
  }
}
