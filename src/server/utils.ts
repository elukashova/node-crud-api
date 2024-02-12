
import { IncomingMessage } from 'node:http';
import { validate } from 'uuid';
import { Actions, Endpoints, Requests } from '../enums/enums';
import { User } from '../types/user.types';

export function defineAction (method: string, url: string) {
    if (method === Requests.Get && url === Endpoints.GetUsers) {
        return Actions.GetUsers;
    } else if (method === Requests.Get && url.startsWith(Endpoints.GetUser)) {
        return Actions.GetUser;
    } else if (method === Requests.Post) {
        return Actions.CreateUser;
    } else if (method === Requests.Put) {
        return Actions.UpdateUser;
    }
}

export function isValidUser(obj: unknown): obj is User {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }

    if ('username' in obj && 'age' in obj && 'hobbies' in obj) {
        if (!(typeof obj.username === 'string' && typeof obj.age === 'number' && Array.isArray(obj.hobbies))) {
            return false;
        }
    
        return obj.hobbies.every(hobby => typeof hobby === 'string');
    }

    return false;
}

export function getUuid(url: string): string | null {
    return url.slice(url.lastIndexOf('/') + 1);
}

export function isValidUuid(userUuid: string): boolean {
    return validate(userUuid);
}

export function getBodyData(request: IncomingMessage): Promise<unknown> {
    return new Promise((resolve, reject) => {
        const bodyChunks: Buffer[] = [];
        request.on('data', (chunk: Buffer) => bodyChunks.push(chunk));
        request.on('error', reject);
        request.on('end', () => {
            const body = Buffer.concat(bodyChunks).toString();
            resolve(JSON.parse(body));
        });
    });
}