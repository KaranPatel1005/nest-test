import {
  AllowNull,
  Column,
  DeletedAt,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({ paranoid: true, timestamps: true })
export class Book extends Model<Book> {
  @AllowNull(false)
  @Column
  title: string;

  @AllowNull(false)
  @Column
  isbn: string;

  @DeletedAt
  deletedAt: Date;
}
