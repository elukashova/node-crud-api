import * as http from 'node:http';
import * as crypto from 'node:crypto';

const port = Number(process.env.PORT) || null;

const server = http.createServer((req, res) => {
  res.end(crypto.randomUUID({ disableEntropyCache: true }));
});

server.listen(port);