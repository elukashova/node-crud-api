import * as http from 'node:http';
import * as crypto from 'node:crypto';
import { Server } from './server/server';

const port = Number(process.env.PORT) || 4000;

const server = new Server(port);