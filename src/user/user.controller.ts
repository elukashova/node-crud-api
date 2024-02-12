import { User, UserData } from './entity/user.interface';
import { UserService } from './user.service';

export class UserController {
    private userService = new UserService();
    getAllUsers(): User[] {
        return this.userService.getAll();
    }

    getUser(uuid: string): User | undefined {
        return this.userService.getUser(uuid);
    }

    createUser(data: UserData): User {
        return this.userService.createUser(data);
    }

    updateUser(data: User): User {
        return this.userService.updateUser(data);
    }

    deleteUser(id: string): void {
        return this.userService.deleteUser(id);
    }
}