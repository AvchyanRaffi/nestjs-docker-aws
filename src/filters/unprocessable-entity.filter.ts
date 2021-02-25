import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { STATUS_CODES } from 'http';
import _ from 'lodash';

@Catch(UnprocessableEntityException)
export class UnprocessableEntityFilter implements ExceptionFilter {
  constructor(public reflector: Reflector) {}
  catch(exception: UnprocessableEntityException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode = exception.getStatus();
    const r = exception.getResponse() as any;

    if (_.isArray(r.message) && r.message[0] instanceof ValidationError) {
      statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      r.error = STATUS_CODES[statusCode];
      const validationErrors = r.message as ValidationError[];
      this._validationFilter(validationErrors);
    }

    r.statusCode = statusCode;

    response.status(r.statusCode).json(r);
  }

  private _validationFilter(validationErrors: ValidationError[]): void {
    for (const validationError of validationErrors) {
      if (!_.isEmpty(validationError.children)) {
        this._validationFilter(validationError.children);
        return;
      }

      for (const [constraintKey, constraint] of Object.entries(
        validationError.constraints,
      )) {
        // convert default messages
        if (!constraint) {
          // convert error message to error.fields.{key} syntax for i18n translation
          validationError.constraints[constraintKey] =
            'error.fields.' + _.snakeCase(constraintKey);
        }
      }
    }
  }
}
