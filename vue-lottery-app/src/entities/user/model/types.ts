export interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password?: string;
  image?: string;
}

export type CreateUserDto = Omit<User, 'id' | 'image'>;

export type UpdateUserDto = Partial<CreateUserDto>;
