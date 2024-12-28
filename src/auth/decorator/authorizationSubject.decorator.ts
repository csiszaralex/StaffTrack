import { SetMetadata } from '@nestjs/common';
import { AppSubjects } from '../casl-ability.factory';

export function AuthorizationSubject(subject: AppSubjects) {
  return SetMetadata('subject', subject);
}
