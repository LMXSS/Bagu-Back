import { Injectable } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class AuthRepository {
  constructor() {

  }

  async createUser(user: UserDto): Promise<void> {

  }

  async updateUser(user: UserDto): Promise<void> {

  }

  async findUserByFirebaseId(uid: string): Promise<UserDto | null | undefined> {
    const user: UserDto | null = null

    return user ? user : null;
  }

  async findUserByEmail(email: string): Promise<UserDto | null> {
    const user: UserDto | null = null;
    return user ? user : null;
  }
}
