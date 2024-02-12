import * as http from 'node:http';
import { Actions, Endpoints, Errors, Requests, StatusCodes } from '../enums/enums';
import { UserController } from '../user/user.controller';
import { defineEndpoint, getUuid, isValidUuid, getBodyData, isValidUser } from './utils';
import { UserData } from '../types/user.types';

export default class RequestHandler {
    private userController = new UserController();
    private response: http.ServerResponse | null = null;

    public async handleRequest(request: http.IncomingMessage, response: http.ServerResponse ) {
        const { method, url } = request;
        if (!method || !url) {
            return;
        }

        this.response = response;
        const endpoint = defineEndpoint(method, url);

        switch(endpoint) {
            case Actions.GetUsers:
                const users = this.userController.getAllUsers();
                this.provideAnswerWithStatusCode(StatusCodes.Ok, JSON.stringify(users));
                break;

            case Actions.GetUser:
                const uuid = getUuid(url);
                if (uuid) {
                    const isValidId = isValidUuid(uuid);
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
            
            case Actions.CreateUser:
                const body: unknown = await getBodyData(request);
                if (isValidUser(body)) {
                    const user = this.userController.createUser(body as UserData);
                    this.provideAnswerWithStatusCode(StatusCodes.Created, JSON.stringify(user));
                    return;
                }
                this.provideAnswerWithStatusCode(StatusCodes.BadRequest, Errors.Message400Body);
                break;

            default:
                console.log('default');
        }
    }

    private provideAnswerWithStatusCode(statusCode: number, output: string): void {
        if (this.response) {
            this.response.writeHead(statusCode);
            this.response.end(output);
        }
    }
}