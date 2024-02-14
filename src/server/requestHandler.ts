import * as http from 'node:http';
import { Actions, Errors, StatusCodes } from '../enums/enums';
import { UserController } from '../user/user.controller';
import { defineAction, getUuid, isValidUuid, isValidUser } from './utils';
import { User, UserData } from '../user/entity/user.interface';
import { ResponseHandler } from './responseHandler';

export class RequestHandler {
    private userController = new UserController();
    private responseHandler: ResponseHandler | null = null;

    public async handleRequest(request: http.IncomingMessage, response: http.ServerResponse ) {
        const { method, url } = request;
        if (!method || !url || !response) {
            return;
        }

        this.responseHandler = new ResponseHandler(response);

        const uuid: string | null = getUuid(url);
        const action: Actions | undefined = defineAction(method, uuid);

        try {
            if (action === Actions.GetUsers && !uuid) {
                this.handleGetAllUsers();
            }

            if (action === Actions.GetUser) {
                this.handleGetUser(uuid);
            }

            if (action === Actions.CreateUser || action === Actions.UpdateUser) {
                const body: unknown = await this.getBodyData(request);

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
            this.responseHandler!.handleError(error);
        }
    }

    private handleGetAllUsers() {
        const users = this.userController.getAllUsers();
        this.responseHandler!.provideResponseWithStatusCode(StatusCodes.Ok, JSON.stringify(users));
    }

    private handleGetUser(uuid: string | null) {
        if (uuid) {
            this.validateUuid(uuid);

            const user = this.userController.getUser(uuid);
            if (!user) {
                this.responseHandler!.provideResponseWithStatusCode(StatusCodes.NotFound, JSON.stringify(Errors.Message404NotFound));
                return;
            }
            
            this.responseHandler!.provideResponseWithStatusCode(StatusCodes.Ok, JSON.stringify(user))
        }
    }

    private handleCreateUser(body: unknown) {
        if (isValidUser(body)) {
            const user = this.userController.createUser(body as UserData);
            this.responseHandler!.provideResponseWithStatusCode(StatusCodes.Created, JSON.stringify(user));
            return;
        }
        throw new Error(Errors.Message400Body);
    }

    private handleUpdateUser(body: unknown, uuid: string | null) {
        if (uuid) {
            this.validateUuid(uuid);

            if (isValidUser(body)) { 
                const { username, age, hobbies } = body as User;
                const updatedData = { id: uuid, username, age, hobbies };
                const user = this.userController.updateUser(updatedData);
                this.responseHandler!.provideResponseWithStatusCode(StatusCodes.Ok, JSON.stringify(user));
                return;
            }
            throw new Error(Errors.Message400Body);
        }
    }

    private handleDeleteUser(uuid: string | null) {
        if (uuid) {
            this.validateUuid(uuid);
            this.userController.deleteUser(uuid);
            this.responseHandler!.provideResponseWithStatusCode(StatusCodes.NoContent);
            return;
        }
    }

    private validateUuid(uuid: string):void {
        if (!isValidUuid(uuid)) {
            throw new Error(Errors.Message400Uuid);
        }
    }

    private getBodyData(request: http.IncomingMessage): Promise<unknown> {
        return new Promise((resolve, reject) => {
            const bodyChunks: Buffer[] = [];
            request.on('data', (chunk: Buffer) => bodyChunks.push(chunk));
            request.on('error', reject);
            request.on('end', () => {
                const body = Buffer.concat(bodyChunks).toString();
                try {
                    resolve(JSON.parse(body));
                } catch (error) {
                    if (error instanceof Error) {
                        error.message = Errors.Message400Body;
                        this.responseHandler!.handleError(error);
                    }
                }
            });
        });
    }
}