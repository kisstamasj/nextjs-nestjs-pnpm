import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

const migrations = ['dist/apps/backend/db/migrations/*.js'];

let dbOptions: DataSourceOptions;

console.log('---------------- DATA SOURCE ----------------------')
console.log(`--- ENV_TYPE: ${process.env.ENV_TYPE} ---`);

switch (process.env.ENV_TYPE) {
  case 'dev':
    dbOptions = {
      type: 'postgres',
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_INTERNAL_PORT || ''),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      entities: ['**/*.entity.js'],
      migrations,
    };
    break;

  // for generate migration
  case 'cli':
    dbOptions = {
      type: 'postgres',
      database: process.env.POSTGRES_DB,
      host: 'localhost',
      port: parseInt(process.env.POSTGRES_EXTERNAL_PORT || ''),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      entities: ['**/*.entity.ts'],
      migrations,
    };
    break;
  case 'test':
    dbOptions = {
      type: 'postgres',
      database: 'test-db',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: '1234',
      entities: ['**/*.entity.ts'],
      migrations,
      migrationsRun: true,
    };
    break;
  case 'prod':
    dbOptions = {
      type: 'postgres',
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_INTERNAL_PORT || ''),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      migrations,
      migrationsRun: true,
      entities: ['**/*.entity.js'],
    };
    break;
  default:
    throw new Error('Unknown environment');
}

export const dataSourceOptions: DataSourceOptions = dbOptions;
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
