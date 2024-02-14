import * as http from 'node:http';
import { StatusCodes, Endpoints, Errors } from '../enums/enums';
import { RequestHandler } from './requestHandler';
import { ResponseHandler } from './responseHandler';

export class Server {
    private server: http.Server | null = null;
    private requestHandler: RequestHandler = new RequestHandler();

    init(port: number) {
        this.server = this.createServer();
        this.startListening(port);
    }

    createServer() {
        return http.createServer((request, response) => {
            const responseHandler = new ResponseHandler(response);
            try {
                if (request.url?.startsWith(Endpoints.Base)) {
                    this.requestHandler.handleRequest(request, response);
                    return;
                } else {
                    responseHandler.provideResponseWithStatusCode(StatusCodes.NotFound, JSON.stringify(Errors.Message404Endpoint));
                }
            } catch (error) {
                responseHandler.provideResponseWithStatusCode(StatusCodes.InternalServerError, JSON.stringify(Errors.Message500Server));
            }
        });
    }

    startListening(port: number) {
        if (this.server) {
            this.server.listen(port, () => {
                console.log(`You are listening to ${port} FM`);
            });
        }
    }
}
