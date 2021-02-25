/* tslint:disable:naming-convention */

import {
  IsPhoneNumber as isPhoneNumber,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsPassword(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: any, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'isPassword',
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string, _args: ValidationArguments) {
          return /^[a-zA-Z0-9!@#$%^&*]*$/.test(value);
        },
      },
    });
  };
}

export function IsPhoneNumber(
  validationOptions?: ValidationOptions & { region?: string },
): (object: any, propertyName: string) => void {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return isPhoneNumber(validationOptions?.region || 'ZZ', {
    message: 'error.phone_number',
    ...validationOptions,
  });
}

export function IsTime(
  validationOptions: ValidationOptions = {},
): (object: any, propertyName: string) => void {
  return (object, propertyName) => {
    registerDecorator({
      propertyName,
      name: 'username',
      target: object.constructor,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          return /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(value.toString());
        },
        defaultMessage(): string {
          return 'error.invalid_time';
        },
      },
    });
  };
}
