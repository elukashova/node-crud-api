import * as http from 'node:http';
import { Actions, Endpoints, Errors, Requests, StatusCodes } from '../enums/enums';
import { UserController } from '../user/user.controller';
import { defineAction, getUuid, isValidUuid, getBodyData, isValidUser } from './utils';
import { User, UserData } from '../types/user.types';

export default class RequestHandler {
    private userController = new UserController();
    private response: http.ServerResponse | null = null;

    public async handleRequest(request: http.IncomingMessage, response: http.ServerResponse ) {
        this.response = response;
        
        const { method, url } = request;
        if (!method || !url) {
            return;
        }

        const body: unknown = await getBodyData(request);
        const uuid = getUuid(url);
        const action = defineAction(method, url);

        switch(action) {
            case Actions.GetUsers:
                const users = this.userController.getAllUsers();
                this.provideAnswerWithStatusCode(StatusCodes.Ok, JSON.stringify(users));
                break;

            case Actions.GetUser:
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
                if (isValidUser(body)) {
                    const user = this.userController.createUser(body as UserData);
                    this.provideAnswerWithStatusCode(StatusCodes.Created, JSON.stringify(user));
                    return;
                }
                this.provideAnswerWithStatusCode(StatusCodes.BadRequest, Errors.Message400Body);
                break;

            case Actions.UpdateUser:
                if (isValidUser(body) && uuid) {
                    const { username, age, hobbies } = body as User;
                    const updatedData = { id: uuid, username, age, hobbies };
                    const user = this.userController.updateUser(updatedData);
                    this.provideAnswerWithStatusCode(StatusCodes.Ok, JSON.stringify(user));
                    return;
                }
                this.provideAnswerWithStatusCode(StatusCodes.BadRequest, Errors.Message400Uuid);
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