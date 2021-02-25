/* tslint:disable:no-string-literal */
import bcrypt from 'bcrypt';
import _ from 'lodash';

export class UtilsService {
  /**
   * convert entity to dto class instance
   * @param {{new(entity: E, options: any): T}} model
   * @param {E[] | E} user
   * @param options
   * @returns {T[] | T}
   */
  public static toDto<T, E>(
    // eslint-disable-next-line no-shadow
    model: new (entity: E, options?: any) => T,
    user: E,
    options?: Record<string, any>,
  ): T;
  public static toDto<T, E>(
    // eslint-disable-next-line no-shadow
    model: new (entity: E, options?: any) => T,
    user: E[],
    options?: Record<string, any>,
  ): T[];
  public static toDto<T, E>(
    // eslint-disable-next-line no-shadow
    model: new (entity: E, options?: any) => T,
    user: E | E[],
    options?: Record<string, any>,
  ): T | T[] {
    if (_.isArray(user)) {
      return user.map((u) => new model(u, options));
    }

    return new model(user, options);
  }

  /**
   * generate hash from password or string
   * @param {string} password
   * @returns {string}
   */
  static generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  /**
   * validate text with hash
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  static validateHash(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) {
      return Promise.resolve(false);
    }
    return bcrypt.compare(password, hash);
  }

  static validatePassword(password: string): boolean {
    const passReg = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/);
    return passReg.test(password);
  }

  /**
   * generate random string
   * @param length
   */
  static generateRandomString(length: number): string {
    return Math.random()
      .toString(36)
      .replace(/[^a-zA-Z0-9]+/g, '')
      .substr(0, length);
  }

  static generatePassword(): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = lowercase.toUpperCase();
    const numbers = '0123456789';

    let text = '';
    for (let i = 0; i < 4; i++) {
      text += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
      text += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
      text += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return text;
  }

  static generatePin(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
