
import { validate } from 'uuid';
import { Actions, Requests } from '../enums/enums';
import { User } from '../user/entity/user.interface';

export function defineAction (method: string, uuid: string | null) {
    if (method === Requests.Get && !uuid) {
        return Actions.GetUsers;
    } else if (method === Requests.Get) {
        return Actions.GetUser;
    } else if (method === Requests.Post) {
        return Actions.CreateUser;
    } else if (method === Requests.Put) {
        return Actions.UpdateUser;
    } else if (method === Requests.Delete) {
        return Actions.DeleteUser;
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
    return url.split('api/users/')[1];
}

export function isValidUuid(userUuid: string): boolean {
    return validate(userUuid);
}