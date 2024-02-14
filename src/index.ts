import 'dotenv/config';
import { Server } from './server/server';

const envPort = parseInt(process.env.PORT || '');
const port = Number.isInteger(envPort) ? envPort : 4000;

const server = new Server();
server.init(port);