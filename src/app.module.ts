import { Module } from '@nestjs/common';
import { RootModule, UsersModule } from './modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { db } from './configs';
import { DataSourceOptions } from 'typeorm';
import { UrlModule } from './modules/url/url.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(db as DataSourceOptions),
    RootModule,
    UsersModule,
    UrlModule,
    AuthModule,
  ],
})
export class AppModule {}
