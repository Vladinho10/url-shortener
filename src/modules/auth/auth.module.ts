import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { jwt_secret } from 'src/configs';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: jwt_secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
  ],
  exports: [AuthService, JwtModule, UsersModule],
})
export class AuthModule {}