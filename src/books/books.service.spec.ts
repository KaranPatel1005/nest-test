import { getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { Book } from './books.model';
import { BooksService } from './books.service';

const testBooks = { title: 'Book', isbn: '1212121212121' };

describe('BooksService', () => {
  let service: BooksService;
  let model: typeof Book;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book),
          useValue: {
            findAll: jest.fn(() => [testBooks]),
            findOne: jest.fn(),
            create: jest.fn(() => testBooks),
            remove: jest.fn(),
            update: jest.fn(() => testBooks),
          },
        },
      ],
    }).compile();
    service = modRef.get(BooksService);
    model = modRef.get<typeof Book>(getModelToken(Book));
  });

  it('should get all books', async () => {
    expect(await service.getBooks()).toEqual([testBooks]);
  });

  it('should create a new book', async () => {
    expect(
      await service.addBook({ title: 'Book', isbn: '1212121212121' }),
    ).toEqual(testBooks);
  });

  it('should get a single book', () => {
    const findSpy = jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);
    expect(service.getBook('id')).rejects.toThrow('No book found');
    expect(findSpy).toBeCalledWith({ where: { id: 'id' } });
  });

  it('should remove a book', async () => {
    const destroyStub = jest.fn();
    const findSpy = jest.spyOn(model, 'findOne').mockReturnValue({
      destroy: destroyStub,
    } as any);
    const retVal = await service.removeBook('id');
    expect(findSpy).toBeCalledWith({ where: { id: 'id' } });
    expect(destroyStub).toBeCalledTimes(1);
    expect(retVal).toBeUndefined();
  });

  it('should update a book', async () => {
    const updateStub = jest.fn();

    const findSpy = jest.spyOn(model, 'findOne').mockReturnValueOnce({
      update: updateStub,
    } as any);

    expect(service.updateBook('id', {}));
    expect(findSpy).toBeCalledWith({ where: { id: 'id' } });
  });
});
