import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookDTO } from './book.dto';
import { Book } from './books.model';
import { BooksService } from './books.service';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async getBooks(): Promise<Book[]> {
    return this.booksService.getBooks();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.getBook(id);
  }

  @Post('new')
  async newBook(@Body() book: BookDTO): Promise<Book> {
    return this.booksService.addBook(book);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.booksService.removeBook(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() book: Partial<Book>,
  ): Promise<Book> {
    return this.booksService.updateBook(id, book);
  }
}
