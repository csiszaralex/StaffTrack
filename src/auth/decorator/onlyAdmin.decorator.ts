import { UseGuards } from '@nestjs/common';
import { OnlyAdminGuard } from '../guard/onlyAdmin.guard';

export function OnlyAdmin() {
  return UseGuards(OnlyAdminGuard);
}
