import {
  Body,
  Controller,
  forwardRef,
  Get,
  HttpException,
  Inject,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Logger } from '@aws-lambda-powertools/logger';
import { UserService } from '../services/UserService';
import { name, version } from '../../package.json';
import { FastifyReply } from 'fastify';
import { ErrorEnum } from '../domain/enums/Error.enum';
import { User } from '../domain/models/UserModel';

@Controller('/1.1/users')
export class UserController {
  private readonly logger: Logger = new Logger({
    serviceName: name,
    logLevel: 'debug',
  });

  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {}

  @Get('/version')
  getVersion(@Res() response: FastifyReply) {
    this.logger.debug(`Version v${version}`);

    return response.status(200).send({ version });
  }

  @Get('/:staffNumber')
  async getUser(
    @Param('staffNumber') staffNumber: string,
    @Res() response: FastifyReply,
  ) {
    try {
      this.logger.info(
        `Calling \`getUserByStaffNumber\` with staff number ${staffNumber}`,
      );

      await this.userService.getUserByStaffNumber(staffNumber);

      return response.status(200).send({ message: 'User found' });
    } catch (err) {
      this.logger.error('[ERROR]: getUser', (err as Error).message);

      if (err instanceof NotFoundException) {
        return response.status(404).send({ message: ErrorEnum.NOT_FOUND });
      }

      return response
        .status(500)
        .send({ message: ErrorEnum.INTERNAL_SERVER_ERROR });
    }
  }

  @Post('/')
  async createUser(@Body() user: User, @Res() response: FastifyReply) {
    try {
      this.logger.info(`Calling \`postUser\` with payload ${user}`);

      await this.userService.postUser(user);

      this.logger.debug(`User added with staff number ${user.staffNumber}`);

      return response
        .status(201)
        .send({ message: `User added: ${user.staffNumber}` });
    } catch (err) {
      this.logger.error('[ERROR]: postUser', (err as Error).message);

      const message =
        err instanceof HttpException &&
        err.message?.includes(ErrorEnum.CREATING)
          ? `${ErrorEnum.INTERNAL_SERVER_ERROR}. ${ErrorEnum.CREATING}.`
          : `${ErrorEnum.INTERNAL_SERVER_ERROR}. ${ErrorEnum.UNKNOWN}.`;

      return response.status(500).send({ message });
    }
  }
}
