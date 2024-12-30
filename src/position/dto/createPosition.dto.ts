import { OmitType } from '@nestjs/swagger';
import { PositionEntity } from './position.entity';

export class CreatePositionDto extends OmitType(PositionEntity, []) {}
