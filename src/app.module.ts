import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './controllers/UserController';
import { UserService } from './services/UserService';
import { UserProvider } from './providers/UserProvider';

@Module({
  controllers: [UserController],
  providers: [UserService, UserProvider],
  exports: [UserService, UserProvider],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
