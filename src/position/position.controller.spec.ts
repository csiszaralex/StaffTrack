import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { CreatePositionDto } from './dto/createPosition.dto';
import { UpdatePositionDto } from './dto/updatePosition.dto';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';

describe('PositionController', () => {
  let controller: PositionController;
  let service: PositionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionController],
      providers: [
        {
          provide: PositionService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PositionController>(PositionController);
    service = module.get<PositionService>(PositionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a position', async () => {
      const createPositionDto: CreatePositionDto = { name: 'Developer' };
      const result = { id: 1, name: 'Developer', description: null };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createPositionDto)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of positions', async () => {
      const result = [{ id: 1, name: 'Developer', description: null }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a position', async () => {
      const result = { id: 1, name: 'Developer', description: null };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
    });

    it('should throw a NotFoundException', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a position', async () => {
      const updatePositionDto: UpdatePositionDto = { name: 'Senior Developer' };
      const result = { id: 1, name: 'Senior Developer', description: null };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(1, updatePositionDto)).toBe(result);
    });

    it('should throw a NotFoundException', async () => {
      const updatePositionDto: UpdatePositionDto = { name: 'Senior Developer' };
      jest.spyOn(service, 'update').mockResolvedValue(null);

      await expect(controller.update(1, updatePositionDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a position', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(true);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.remove(1, res as Response);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).toHaveBeenCalled();
    });

    it('should return NO_CONTENT if position not found', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(false);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.remove(1, res as Response);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
