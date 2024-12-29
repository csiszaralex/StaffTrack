import { applyDecorators, Delete, Get, Patch, Post } from '@nestjs/common';
import { PermissionType } from '@prisma/client';
import { Permission } from './permission.decorator';

export function GetAuth(path?: string | string[]) {
  return applyDecorators(Get(path), Permission(PermissionType.read));
}
export function PostAuth(path?: string | string[]) {
  return applyDecorators(Post(path), Permission(PermissionType.create));
}
export function PatchAuth(path?: string | string[]) {
  return applyDecorators(Patch(path), Permission(PermissionType.update));
}
export function DeleteAuth(path?: string | string[]) {
  return applyDecorators(Delete(path), Permission(PermissionType.delete));
}
