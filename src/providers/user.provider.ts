import { UserEntity } from '../modules/user/user.entity';
import { ContextService } from './context.service';

export class UserProvider {
  private static readonly _authRoleKey = 'user';

  static getAuthUser(): UserEntity {
    return ContextService.get(UserProvider._authRoleKey);
  }

  static setAuthUser(user: UserEntity): void {
    ContextService.set(this._authRoleKey, user);
  }
}
