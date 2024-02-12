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

        const uuid: string | null = getUuid(url);
        const action: Actions | undefined = defineAction(method, url, uuid);

        try {
            if (action === Actions.GetUsers) {
                this.handleGetAllUsers();
            }

            if (action === Actions.GetUser) {
                this.handleGetUser(uuid);
            }

            if (action === Actions.CreateUser || action === Actions.UpdateUser) {
                const body: unknown = await getBodyData(request);

                if (action === Actions.CreateUser) {
                    this.handleCreateUser(body);
                } else {
                    this.handleUpdateUser(body, uuid);
                }
            }

            if (action === Actions.DeleteUser) {
                this.handleDeleteUser(uuid);
            }

        } catch (error) {
            console.log(error);
        }
    }

    private handleGetAllUsers() {
        const users = this.userController.getAllUsers();
        this.provideResponseWithStatusCode(StatusCodes.Ok, JSON.stringify(users));
    }

    private handleGetUser(uuid: string | null) {
        if (uuid) {
            if (!isValidUuid(uuid)) {
                this.provideResponseWithStatusCode(StatusCodes.BadRequest, Errors.Message400Uuid);
                return;
            }
            const user = this.userController.getUser(uuid);
            if (!user) {
                this.provideResponseWithStatusCode(StatusCodes.NotFound, Errors.Message404);
                return;
            }
            
            this.provideResponseWithStatusCode(StatusCodes.Ok, JSON.stringify(user))
        }
    }

    private handleCreateUser(body: unknown) {
        if (isValidUser(body)) {
            const user = this.userController.createUser(body as UserData);
            this.provideResponseWithStatusCode(StatusCodes.Created, JSON.stringify(user));
            return;
        }
        this.provideResponseWithStatusCode(StatusCodes.BadRequest, Errors.Message400Body);
    }

    private handleUpdateUser(body: unknown, uuid: string | null) {
        if (uuid) {
            if (isValidUser(body)) { 
                if (!isValidUuid(uuid)) {
                    this.provideResponseWithStatusCode(StatusCodes.BadRequest, Errors.Message400Uuid);
                    return;
                }
    
                const { username, age, hobbies } = body as User;
                const updatedData = { id: uuid, username, age, hobbies };
                const user = this.userController.updateUser(updatedData);
                this.provideResponseWithStatusCode(StatusCodes.Ok, JSON.stringify(user));
                return;
            }
        }
        this.provideResponseWithStatusCode(StatusCodes.BadRequest, Errors.Message400Uuid);
    }

    private handleDeleteUser(uuid: string | null) {
        if (uuid) {
            if (!isValidUuid(uuid)) {
                this.provideResponseWithStatusCode(StatusCodes.BadRequest, Errors.Message400Uuid);
                return;
            }
            this.userController.deleteUser(uuid);
            this.provideResponseWithStatusCode(StatusCodes.NoContent);
            return;
        }
        this.provideResponseWithStatusCode(StatusCodes.BadRequest, Errors.Message400Uuid);
    }

    private provideResponseWithStatusCode(statusCode: number, output?: string): void {
        if (this.response) {
            this.response.writeHead(statusCode);
            this.response.end(output || null);
        }
    }
}