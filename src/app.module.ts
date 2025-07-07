import { Module } from '@nestjs/common';
import { RootModule, UsersModule } from './modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { db } from './configs';
import { DataSourceOptions } from 'typeorm';
import { UrlModule } from './modules/url/url.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 1 minute in milliseconds
        limit: 100, // maximum 100 requests per minute
      },
    ]),
    TypeOrmModule.forRoot(db as DataSourceOptions),
    RootModule,
    UsersModule,
    UrlModule,
    AuthModule,
  ],
    providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // ... other providers
  ],
})
export class AppModule {}
