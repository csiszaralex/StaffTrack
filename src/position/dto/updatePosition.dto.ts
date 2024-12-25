import { PartialType } from '@nestjs/swagger';
import { CreatePositionDto } from './createPosition.dto';

export class UpdatePositionDto extends PartialType(CreatePositionDto) {}
