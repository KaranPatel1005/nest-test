import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class BookDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'isbn is required' })
  @Length(13, 13, { message: 'isbn must be 13 characters long' })
  isbn: string;
}
