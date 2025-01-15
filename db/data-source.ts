import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    isProduction
      ? path.join(__dirname, '../dist/**/*.entity.js')
      : path.join(__dirname, '../src/**/*.entity.ts'),
  ],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  connectTimeoutMS: 10000,
});

(async () => {
  try {
    await AppDataSource.initialize();
    console.log('DataSource has been initialized!');
  } catch (error) {
    console.error('Error during DataSource initialization:', error);
  }
})();
