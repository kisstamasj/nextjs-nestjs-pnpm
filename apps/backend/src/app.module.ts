import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot(dataSourceOptions),
    TestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
