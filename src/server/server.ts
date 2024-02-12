import * as http from 'node:http';
import { StatusCodes, Endpoints, Errors } from '../enums/enums';
import RequestHandler from './requestHandler';

export class Server {
    private server: http.Server;
    private requestHandler: RequestHandler = new RequestHandler();

    constructor(private port: number) {
        this.server = this.createServer();
        this.startListening(port);
    }

    createServer() {
        return http.createServer((request, response) => {
            try {
                if (request.url?.startsWith(Endpoints.Base)) {
                    this.requestHandler.handleRequest(request, response);
                    return;
                } else {
                    response.writeHead(StatusCodes.NotFound);
                    response.end(JSON.stringify(Errors.Message404Endpoint));
                }
            } catch (error) {
                response.writeHead(StatusCodes.InternalServerError);
                response.end(JSON.stringify(Errors.Message500Server));
            }
        });
    }

    startListening(port: number) {
        this.server.listen(port, () => {
            console.log(`You are listening to ${port} FM`);
        });
    }
}
