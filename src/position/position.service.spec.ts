import { Test, TestingModule } from '@nestjs/testing';
import { Position } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePositionDto } from './dto/createPosition.dto';
import { UpdatePositionDto } from './dto/updatePosition.dto';
import { PositionService } from './position.service';

describe('PositionService', () => {
  let service: PositionService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PositionService, PrismaService],
    }).compile();

    service = module.get<PositionService>(PositionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a position', async () => {
      const createPositionDto: CreatePositionDto = { name: 'Developer' };
      const position: Position = {
        id: 1,
        name: 'Developer',
        description: null,
      };

      jest.spyOn(prisma.position, 'create').mockResolvedValue(position);

      expect(await service.create(createPositionDto)).toEqual(position);
    });
  });

  describe('findAll', () => {
    it('should return an array of positions', async () => {
      const positions: Position[] = [
        {
          id: 1,
          name: 'Developer',
          description: null,
        },
      ];

      jest.spyOn(prisma.position, 'findMany').mockResolvedValue(positions);

      expect(await service.findAll()).toEqual(positions);
    });
  });

  describe('findOne', () => {
    it('should return a single position', async () => {
      const position: Position = {
        id: 1,
        name: 'Developer',
        description: null,
      };

      jest.spyOn(prisma.position, 'findUnique').mockResolvedValue(position);

      expect(await service.findOne(1)).toEqual(position);
    });

    it('should return null if position not found', async () => {
      jest.spyOn(prisma.position, 'findUnique').mockResolvedValue(null);

      expect(await service.findOne(1)).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a position', async () => {
      const updatePositionDto: UpdatePositionDto = { name: 'Senior Developer' };
      const position: Position = {
        id: 1,
        name: 'Senior Developer',
        description: null,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(position);
      jest.spyOn(prisma.position, 'update').mockResolvedValue(position);

      expect(await service.update(1, updatePositionDto)).toEqual(position);
    });

    it('should return null if position not found', async () => {
      const updatePositionDto: UpdatePositionDto = { name: 'Senior Developer' };

      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      expect(await service.update(1, updatePositionDto)).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a position', async () => {
      const position: Position = {
        id: 1,
        name: 'Developer',
        description: null,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(position);
      jest.spyOn(prisma.position, 'delete').mockResolvedValue(position);

      expect(await service.remove(1)).toBe(true);
    });

    it('should return false if position not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      expect(await service.remove(1)).toBe(false);
    });
  });
});
