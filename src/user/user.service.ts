import { userDatabase } from '../data/user.data';
import { Errors } from '../enums/enums';
import { User } from '../types/user.types';

export class UserService {
    getAll(): User[] {
        return Array.from(userDatabase.values());
    }

    getUser(uuid: String): User | undefined {
        const user = Array.from(userDatabase.values()).find(user => user.id === uuid);

        if (!user) {
            throw new Error(Errors.Message404);
        }

        return user;
    }
}