import { Test } from '@nestjs/testing';
import { Book } from './books.model';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

const testBook = { id: 1, title: 'Book', isbn: '1212121212121' };

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            getBooks: jest.fn(() => [testBook]),
            addBook: jest.fn(() => testBook),
            getBook: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                title: 'Book',
                isbn: '1212121212121',
                id,
              }),
            ),
            removeBook: jest.fn(),
            updateBook: jest
              .fn()
              .mockImplementation((id: string, book: Partial<Book>) =>
                Promise.resolve({
                  title: 'Book',
                  isbn: '1212121212121',
                  id,
                  ...book,
                }),
              ),
          },
        },
      ],
    }).compile();
    controller = modRef.get(BooksController);
    service = modRef.get<BooksService>(BooksService);
  });

  it('should get all books', async () => {
    expect(await controller.getBooks()).toEqual([testBook]);
  });

  it('should create a new book', async () => {
    expect(
      await controller.newBook({
        title: 'Book',
        isbn: '1212121212121',
      }),
    ).toEqual(testBook);
  });

  it('should get a single book', async () => {
    await controller.findOne('a id');
    expect(service.getBook).toHaveBeenCalled();
    expect(controller.findOne('a id')).resolves.toEqual({
      title: 'Book',
      isbn: '1212121212121',
      id: 'a id',
    });
  });

  it('should remove a book', async () => {
    await controller.remove('anyid');
    expect(service.removeBook).toHaveBeenCalled();
  });

  it('should update a book', async () => {
    const book = await controller.update('1', { title: 'Book 1' });
    expect(book).toEqual({
      id: '1',
      title: 'Book 1',
      isbn: '1212121212121',
    });
    expect(service.updateBook).toHaveBeenCalled();
  });
});
