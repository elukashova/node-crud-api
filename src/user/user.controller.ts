import { User } from '../types/user.types';
import { UserService } from './user.service';

export class UserController {
    private userService = new UserService();
    getAllUsers(): User[] {
        return this.userService.getAll();
    }

    getUser(uuid: string): User | undefined {
        return this.userService.getUser(uuid);
    }
}