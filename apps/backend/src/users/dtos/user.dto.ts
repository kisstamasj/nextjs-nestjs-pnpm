import { Expose } from 'class-transformer';
import { Tokens } from '../../auth/auth.service';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  tokens: Tokens;
}
