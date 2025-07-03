import { Module } from '@nestjs/common';
import { RootModule, UsersModule } from './modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { db } from './configs';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(db as DataSourceOptions),
    RootModule,
    UsersModule,
  ],
})
export class AppModule {}
