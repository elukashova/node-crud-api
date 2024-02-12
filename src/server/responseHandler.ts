import { ServerResponse } from 'node:http';
import { Errors, StatusCodes } from '../enums/enums';

export class ResponseHandler {
    constructor(private response: ServerResponse) {}

    public handleError(error: unknown) {
        if (error instanceof Error) {
            switch(error.message) {
                case Errors.Message400Uuid: 
                    this.provideResponseWithStatusCode(StatusCodes.BadRequest, Errors.Message400Uuid);
                    break;

                case Errors.Message400Body:
                    this.provideResponseWithStatusCode(StatusCodes.BadRequest, Errors.Message400Body);
                    break;

                case Errors.Message404User: 
                    this.provideResponseWithStatusCode(StatusCodes.NotFound, Errors.Message404User);
                    break;

                case Errors.Message404Endpoint: 
                    this.provideResponseWithStatusCode(StatusCodes.NotFound, Errors.Message404Endpoint);
                    break;

                default:
                    this.provideResponseWithStatusCode(StatusCodes.InternalServerError, Errors.Message500Server);
            }
        }
    }
    public provideResponseWithStatusCode(statusCode: number, output?: string): void {
        if (this.response) {
            this.response.writeHead(statusCode);
            this.response.end(output || null);
        }
    }
}