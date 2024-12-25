import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { prismaWithLogging } from './prismaWithLogging';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
    Object.assign(this, prismaWithLogging);
  }
}
