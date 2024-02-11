import { userDatabase } from '../data/user.data';
import { User } from '../types/user.types';

export class UserService {
    getAll(): User[] {
        return Array.from(userDatabase.values());
    }
}