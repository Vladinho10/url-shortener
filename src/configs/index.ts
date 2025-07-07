const rootPath = process.cwd();
import * as dotEnvFlow from 'dotenv-flow';
dotEnvFlow.config({ path: `${rootPath}/src/envs` });

import { database } from './db';
import DocumentBuilder from './swagger';

export const db = database;
export const port = process.env.PORT;
export const jwt_secret = process.env.JWT_SECRET;
export const swagger = DocumentBuilder;
