/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/tslint/config */
import 'source-map-support/register';

import _ from 'lodash';
import { Brackets, QueryBuilder, SelectQueryBuilder } from 'typeorm';

import { AbstractEntity } from './common/abstract.entity';
import { AbstractDto } from './common/dto/abstract.dto';
import { PageMetaDto } from './common/dto/PageMetaDto';
import { PageOptionsDto } from './common/dto/PageOptionsDto';

declare global {
  interface Array<T> {
    toDtos<B extends AbstractDto>(
      this: AbstractEntity<B>[],
      options?: any,
    ): B[];
  }
}

declare module 'typeorm' {
  // eslint-disable-next-line no-shadow
  interface QueryBuilder<Entity> {
    searchByString(q: string, columnNames: string[]): this;
  }

  // eslint-disable-next-line no-shadow
  interface SelectQueryBuilder<Entity> {
    paginate(
      this: SelectQueryBuilder<Entity>,
      pageOptionsDto: PageOptionsDto,
    ): Promise<[Entity[], PageMetaDto]>;
  }
}

Array.prototype.toDtos = function <B extends AbstractDto>(options?: any): B[] {
  return _(this)
    .map((item) => item.toDto(options))
    .compact()
    .value() as B[];
};

QueryBuilder.prototype.searchByString = function (q, columnNames) {
  if (!q) {
    return this;
  }
  this.andWhere(
    new Brackets((qb) => {
      for (const item of columnNames) {
        qb.orWhere(`${item} ILIKE :q`);
      }
    }),
  );

  this.setParameter('q', `%${q}%`);

  return this;
};

SelectQueryBuilder.prototype.paginate = async function <Entity>(
  this: SelectQueryBuilder<Entity>,
  pageOptionsDto: PageOptionsDto,
): Promise<[Entity[], PageMetaDto]> {
  const [items, itemCount] = await this.skip(pageOptionsDto.skip)
    .take(pageOptionsDto.take)
    .getManyAndCount();

  const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

  return [items, pageMetaDto];
};
