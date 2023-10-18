import { EntityRepository, Repository } from 'typeorm';
import { BookStore } from '../domain/book-store.entity';

@EntityRepository(BookStore)
export class BookStoreRepository extends Repository<BookStore> {}
