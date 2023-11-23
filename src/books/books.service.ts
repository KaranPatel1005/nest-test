import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BookDTO } from './book.dto';
import { Book } from './books.model';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book) private readonly booksRepo: typeof Book) {}

  private async findBookById(id: string): Promise<Book | null> {
    return this.booksRepo.findOne({
      where: { id },
    });
  }

  private handleNotFound(book: Book | null): void {
    if (!book) {
      throw new NotFoundException('No book found');
    }
  }

  async getBooks(): Promise<Book[]> {
    return await this.booksRepo.findAll();
  }

  async getBook(id: string): Promise<Book> {
    const book = await this.findBookById(id);
    this.handleNotFound(book);
    return book;
  }

  async addBook(book: BookDTO): Promise<Book> {
    return this.booksRepo.create(book);
  }

  async removeBook(id: string): Promise<void> {
    const book = await this.findBookById(id);
    this.handleNotFound(book);
    await book.destroy();
  }

  async updateBook(id: string, updateBook: Partial<Book>): Promise<Book> {
    const book = await this.findBookById(id);
    this.handleNotFound(book);
    return book.update(updateBook);
  }
}
