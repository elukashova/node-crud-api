import { User } from '../types/user.types';
import { UserService } from './user.service';

export class UserController {
    private userService = new UserService();
    getAllUsers(): User[] {
        return this.userService.getAll();
    }
}