import { v4 as uuid4 } from 'uuid';
import { userDatabase } from '../data/user.data';
import { Errors } from '../enums/enums';
import { User, UserData } from '../types/user.types';
import { NewUser } from './user';

export class UserService {
    public getAll(): User[] {
        return Array.from(userDatabase.values());
    }

    public getUser(uuid: String): User | undefined {
        const user = Array.from(userDatabase.values()).find(user => user.id === uuid);

        if (!user) {
            throw new Error(Errors.Message404User);
        }

        return user;
    }

    public createUser({ username, age, hobbies }: UserData): User {
        const id = uuid4();
        const user = new NewUser(id, username, age, hobbies);
        userDatabase.set(user.id, user);
        return user;
    }

    public updateUser(user: User): User {
        const { id } = user; 
        const savedUser = userDatabase.get(id) ?? null;
        if (!savedUser) {
            throw new Error(Errors.Message404User);
        }
        userDatabase.set(id, user);
        return user;
    }

    public deleteUser(id: string): void {
        const isDeleted = userDatabase.delete(id);
        if (!isDeleted) {
            throw new Error(Errors.Message404User);
        }
    }
}