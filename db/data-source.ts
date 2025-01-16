import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const isDistDir = __dirname.slice(-7) === 'dist/db';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    isDistDir ? path.join(process.cwd(), '/dist/src/**/*.entity{.ts,.js}') : path.join(process.cwd(), '/src/**/*.entity{.ts,.js}'),
  ],
  migrations: [
    isDistDir ? path.join(process.cwd(), '/dist/src/migrations/**/*{.ts,.js}') : path.join(process.cwd(), '/src/migrations/**/*{.ts,.js}'),
  ],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  connectTimeoutMS: 10000,
});
