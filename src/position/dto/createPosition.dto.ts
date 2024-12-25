import { OmitType } from '@nestjs/swagger';
import { PositionEntityDto } from './positionEntity.dto';

export class CreatePositionDto extends OmitType(PositionEntityDto, []) {}
