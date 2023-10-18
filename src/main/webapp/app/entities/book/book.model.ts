import { IAuthor } from 'app/entities/author/author.model';
import { IBookStore } from 'app/entities/book-store/book-store.model';

export interface IBook {
  id?: number;
  title?: string;
  description?: string | null;
  authors?: IAuthor[] | null;
  bookStores?: IBookStore[] | null;
}

export class Book implements IBook {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string | null,
    public authors?: IAuthor[] | null,
    public bookStores?: IBookStore[] | null
  ) {}
}

export function getBookIdentifier(book: IBook): number | undefined {
  return book.id;
}
