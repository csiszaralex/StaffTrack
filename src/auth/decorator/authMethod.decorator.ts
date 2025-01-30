import { applyDecorators, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PermissionType } from '@prisma/client';
import { AppSubjects } from '../casl-ability.factory';
import { AuthorizationSubject } from './authorizationSubject.decorator';
import { Permission } from './permission.decorator';

export function swagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Need to be authenticate, first login' }),
    ApiForbiddenResponse({ description: "You don't have permission for that" }),
  );
}

export function AuthController(subject: AppSubjects & string) {
  return applyDecorators(Controller(subject.toString()), AuthorizationSubject(subject));
}

export function GetAuth(path?: string | string[]) {
  return applyDecorators(
    Get(path),
    Permission(PermissionType.read),
    swagger(),
    ApiOkResponse({ description: 'Resource successfully fetched' }),
  );
}
export function PostAuth(path?: string | string[]) {
  return applyDecorators(
    Post(path),
    Permission(PermissionType.create),
    swagger(),
    ApiCreatedResponse({ description: 'Resource successfully created' }),
  );
}
export function PatchAuth(path?: string | string[]) {
  return applyDecorators(Patch(path), Permission(PermissionType.update), swagger());
}
export function DeleteAuth(path?: string | string[]) {
  return applyDecorators(
    Delete(path),
    Permission(PermissionType.delete),
    swagger(),
    ApiOkResponse({ description: 'Resource successfully deleted' }),
    ApiNoContentResponse({ description: 'Resource not exist' }),
  );
}
