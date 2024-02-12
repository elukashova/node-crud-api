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
                }
            } catch (error) {
                response.writeHead(StatusCodes.NotFound);
                response.end(Errors.Message404);
            }
        });
    }

    startListening(port: number) {
        this.server.listen(port, () => {
            console.log(
                "I'm listening",
                this.port,
            );
        });
    }
}
