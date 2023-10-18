import { IBook } from 'app/entities/book/book.model';

export interface IBookStore {
  id?: number;
  bookStoreName?: string | null;
  postalCode?: string | null;
  city?: string | null;
  stateProvince?: string | null;
  books?: IBook[] | null;
}

export class BookStore implements IBookStore {
  constructor(
    public id?: number,
    public bookStoreName?: string | null,
    public postalCode?: string | null,
    public city?: string | null,
    public stateProvince?: string | null,
    public books?: IBook[] | null
  ) {}
}

export function getBookStoreIdentifier(bookStore: IBookStore): number | undefined {
  return bookStore.id;
}
