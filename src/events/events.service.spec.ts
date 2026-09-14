import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { EventsService } from './events.service';
import { Event } from './entities/event.entity';

describe('EventsService', () => {
  let service: EventsService;
  let repository: jest.Mocked<Repository<Event>>;

  const mockEvent: Event = {
    id: 1,
    title: 'Концерт рок-группы',
    description: 'Описание',
    date: '2026-05-01',
    address: 'ул. Пушкина, 1',
    location: 'Москва',
    price: 1500,
    capacity: 100,
    coverUrl: 'https://example.com/cover.jpg',
    user: { id: 1 } as any,
    category: { id: 1 } as any,
  };

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get(getRepositoryToken(Event));
  });

  // ---------- findAll ----------
  describe('findAll', () => {
    it('возвращает все события без фильтров', async () => {
      repository.find.mockResolvedValue([mockEvent]);

      const result = await service.findAll({});

      expect(result).toEqual([mockEvent]);
      expect(repository.find).toHaveBeenCalledWith({
        where: {},
        relations: ['category', 'user'],
      });
    });

    it('ищет по title (частичное совпадение через Like)', async () => {
      repository.find.mockResolvedValue([mockEvent]);

      await service.findAll({ title: 'рок' });

      expect(repository.find).toHaveBeenCalledWith({
        where: { title: Like('%рок%') },
        relations: ['category', 'user'],
      });
    });

    it('фильтрует по categoryId', async () => {
      repository.find.mockResolvedValue([mockEvent]);

      await service.findAll({ categoryId: 1 });

      expect(repository.find).toHaveBeenCalledWith({
        where: { category: { id: 1 } },
        relations: ['category', 'user'],
      });
    });

    it('комбинирует title и categoryId', async () => {
      repository.find.mockResolvedValue([mockEvent]);

      await service.findAll({ title: 'рок', categoryId: 1 });

      expect(repository.find).toHaveBeenCalledWith({
        where: { title: Like('%рок%'), category: { id: 1 } },
        relations: ['category', 'user'],
      });
    });

    it('возвращает пустой массив, если ничего не найдено', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAll({ title: 'нет_такого' });

      expect(result).toEqual([]);
    });
  });

  // ---------- findOne ----------
  describe('findOne', () => {
    it('возвращает событие по id', async () => {
      repository.findOne.mockResolvedValue(mockEvent);

      const result = await service.findOne(1);

      expect(result).toEqual(mockEvent);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['category', 'user'],
      });
    });

    it('бросает NotFoundException, если события нет', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Event with id 999 not found',
      );
    });
  });

  // ---------- create ----------
  describe('create', () => {
    it('создаёт событие и сохраняет его', async () => {
      const dto = {
        title: 'Новый',
        description: 'Описание',
        date: '2026-07-01',
        categoryId: 2,
      };

      repository.create.mockReturnValue({
        ...dto,
        category: { id: 2 },
      } as any);
      repository.save.mockResolvedValue({ id: 5, ...dto } as any);

      const result = await service.create(dto as any);

      expect(repository.create).toHaveBeenCalledWith({
        ...dto,
        category: { id: 2 },
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
    });
  });

  // ---------- update ----------
  describe('update', () => {
    it('обновляет только переданные поля', async () => {
      const existing = { ...mockEvent, category: { id: 1 } } as any;
      repository.findOne.mockResolvedValue(existing);
      repository.save.mockResolvedValue({ ...existing, title: 'Изменённое' });

      const result = await service.update(1, { title: 'Изменённое' } as any);

      expect(result.title).toBe('Изменённое');
      expect(result.description).toBe(mockEvent.description); // не тронуто
    });

    it('обновляет categoryId, если передан', async () => {
      const existing = { ...mockEvent, category: { id: 1 } } as any;
      repository.findOne.mockResolvedValue(existing);
      repository.save.mockResolvedValue(existing);

      await service.update(1, { categoryId: 3 } as any);

      expect(existing.category).toEqual({ id: 3 });
    });

    it('бросает NotFoundException при обновлении несуществующего', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { title: 'x' } as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ---------- remove ----------
  describe('remove', () => {
    it('удаляет событие по id', async () => {
      repository.findOne.mockResolvedValue(mockEvent);
      repository.remove.mockResolvedValue(mockEvent);

      await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(mockEvent);
    });

    it('бросает NotFoundException, если события нет', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});