export interface User {
  readonly id: string;
  username: string;
  hobbies: string[];
  age: number;
}

export type UserData = Omit<User, 'id'>;