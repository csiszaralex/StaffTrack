import {
  Body,
  Controller,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { Position } from '@prisma/client';
import { Response } from 'express';
import { DeleteAuth, GetAuth, PatchAuth, PostAuth } from 'src/auth/decorator/authMethod.decorator';
import { AuthorizationSubject } from 'src/auth/decorator/authorizationSubject.decorator';
import { CreatePositionDto } from './dto/createPosition.dto';
import { UpdatePositionDto } from './dto/updatePosition.dto';
import { PositionService } from './position.service';

@Controller('position')
@AuthorizationSubject('Position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @PostAuth()
  async create(@Body() createPositionDto: CreatePositionDto): Promise<Position> {
    return this.positionService.create(createPositionDto);
  }

  @GetAuth()
  findAll(): Promise<Position[]> {
    return this.positionService.findAll();
  }

  @GetAuth(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Position> {
    const pos = await this.positionService.findOne(id);
    if (!pos) throw new NotFoundException(`Position with id ${id} not found`);
    return pos;
  }

  @PatchAuth(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    const pos = await this.positionService.update(id, updatePositionDto);
    if (!pos) throw new NotFoundException(`Position with id ${id} not found`);
    return pos;
  }

  @DeleteAuth(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const deleted = await this.positionService.remove(id);
    if (!deleted) res.status(HttpStatus.NO_CONTENT);
    res.send();
  }
}
