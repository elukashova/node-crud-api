import * as http from 'node:http';
import { Endpoints, Requests } from './enums/enums';
import { UserController } from '../user/user.controller';

export default class RequestHandler {
    private userController = new UserController();

    public handleRequest({ method, url }: http.IncomingMessage, response: http.ServerResponse ) {
        if (method === Requests.Get && url === Endpoints.GetUsers) {
            const users = this.userController.getAllUsers();
            response.writeHead(200);
            response.end(JSON.stringify(users));
        }
    }
}