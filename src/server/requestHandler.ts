import * as http from 'node:http';
import { validate } from 'uuid';
import { Endpoints, Errors, Requests, StatusCodes } from '../enums/enums';
import { UserController } from '../user/user.controller';

export default class RequestHandler {
    private userController = new UserController();
    private response: http.ServerResponse | null = null;

    public handleRequest({ method, url }: http.IncomingMessage, response: http.ServerResponse ) {
        if (!method || !url) {
            return;
        }

        this.response = response;
        const endpoint = this.defineEndpoint(method, url);

        switch(endpoint) {
            case Endpoints.GetUsers:
                const users = this.userController.getAllUsers();
                this.provideAnswerWithStatusCode(StatusCodes.Ok, JSON.stringify(users));
                break;

            case Endpoints.GetUser:
                const uuid = this.getUuid(url);
                if (uuid) {
                    const isValidId = this.isValidUuid(uuid);
                    if (!isValidId) {
                        this.provideAnswerWithStatusCode(StatusCodes.BadRequest, Errors.Message400Uuid);
                        return;
                    }
                    const user = this.userController.getUser(uuid);
                    if (!user) {
                        this.provideAnswerWithStatusCode(StatusCodes.NotFound, Errors.Message404);
                        return;
                    }
                    
                    this.provideAnswerWithStatusCode(StatusCodes.Ok, JSON.stringify(user))
                }
                break;
            default:
                console.log('default');
        }
    }

    private defineEndpoint (method: string, url: string) {
        if (method === Requests.Get && url === Endpoints.GetUsers) {
            return Endpoints.GetUsers;
        } else if (method === Requests.Get && url.startsWith(Endpoints.GetUser)) {
            return Endpoints.GetUser;
        }
    }

    private getUuid(url: string): string | null {
        return url.slice(url.lastIndexOf('/') + 1);
    }

    private isValidUuid(userUuid: string): boolean {
        return validate(userUuid);
    }

    private provideAnswerWithStatusCode(statusCode: number, output: string): void {
        if (this.response) {
            this.response.writeHead(statusCode);
            this.response.end(output);
        }
    }
}