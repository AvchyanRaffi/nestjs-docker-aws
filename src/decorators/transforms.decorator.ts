/* tslint:disable:naming-convention */

import { Transform, TransformFnParams } from 'class-transformer';
import _ from 'lodash';
import moment from 'moment';

/**
 * @description trim spaces from start and end, replace multiple spaces with one.
 * @example
 * @ApiProperty()
 * @IsString()
 * @Trim()
 * name: string;
 * @returns {(target: any, key: string) => void}
 * @constructor
 */
export function Trim(): (target: any, key: string) => void {
  return Transform((value: any) => {
    if (_.isArray(value)) {
      return value.map((v) => _.trim(v).replace(/\s\s+/g, ' '));
    }

    if (value) {
      return _.trim(value).replace(/\s\s+/g, ' ');
    }
  });
}

/**
 * @description convert string or number to integer
 * @example
 * @IsNumber()
 * @ToInt()
 * name: number;
 * @returns {(target: any, key: string) => void}
 * @constructor
 */
export function ToInt(): (target: any, key: string) => void {
  return Transform((value: any) => parseInt(value, 10), { toClassOnly: true });
}

/**
 * @description transforms to array, specially for query params
 * @example
 * @IsNumber()
 * @ToArray()
 * name: number;
 * @constructor
 */
export function ToArray(): (target: any, key: string) => void {
  return Transform(
    (value) => {
      if (_.isNil(value)) {
        return [];
      }
      return _.castArray(value);
    },
    { toClassOnly: true },
  );
}

export function ToBoolean(): (target: any, key: string) => void {
  return Transform(
    (value: any) => {
      switch (value) {
        case 'true':
          return true;
        case 'false':
          return false;
        default:
          return value;
      }
    },
    { toClassOnly: true },
  );
}

export function ToDate(
  format?: moment.MomentFormatSpecification,
): (target: any, key: string) => void {
  return Transform(
    (value: any): Date => {
      if (!value) {
        return;
      }

      if (!isNaN(value) && !_.isDate(value)) {
        value = _.toNumber(value);
      }

      if (value && format) {
        const m = moment(value, format, true).utc(true);
        if (m.isValid()) {
          return m.toDate();
        }
      } else {
        return moment(value).toDate();
      }
    },
    { toClassOnly: true },
  );
}

export function ToLowerCase(): (target: any, key: string) => void {
  return Transform(
    (value) => {
      if (!value) {
        return;
      }
      if (!Array.isArray(value)) {
        return value.value.toLowerCase();
      }

      return value.map((v) => v.toLowerCase());
    },
    {
      toClassOnly: true,
    },
  );
}
