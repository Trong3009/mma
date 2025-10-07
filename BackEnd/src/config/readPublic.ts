import path from 'path';
import express, { Express } from 'express';
import { fileURLToPath } from 'url';

// 👇 Tạo lại __dirname trong ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const readOnly = (app: Express): void => {
  app.use('/public', express.static(path.join(__dirname, '../public')));
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'ejs');
};
