import { SetMetadata } from '@nestjs/common';

import { RoleTypeEnum } from '../common/constants';

// eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/explicit-module-boundary-types
export const Roles = (...roles: RoleTypeEnum[]) => SetMetadata('roles', roles);
