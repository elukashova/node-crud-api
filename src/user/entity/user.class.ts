import { User } from './user.interface';

export class NewUser implements User {
    constructor(
        public readonly id: string, 
        public username: string, 
        public age: number,
        public hobbies: string[],
    ) {}
}