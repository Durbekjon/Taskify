import { PASSWORD_SALT } from '@/consts/password-salt';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UtilsService {
  generateBcrypt = async (password: string) => {
    return bcrypt.hash(password, PASSWORD_SALT);
  };
  compareHash = async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
  };
}
